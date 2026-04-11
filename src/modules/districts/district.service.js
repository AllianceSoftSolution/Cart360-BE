// BACKEND/src/modules/districts/district.service.js

import mongoose from 'mongoose';
import District from './district.model.js';
import User from '../users/user.model.js';
import { paginate } from '../../utils/pagination.js';
import { formatDoc } from '../../utils/helpers.js';

const REF_MAP = {
  academicYearId: 'academic_year_id',
  countryId: 'country_id',
  stateId: 'state_id',
  countyId: 'county_id',
  superintendentId: 'superintendent_id',
};

/**
 * Format a district document for API response, including populated names.
 */
const toResponse = (doc) => {
  const result = formatDoc(doc, REF_MAP);
  if (!result) return null;

  // Extract populated reference names
  if (doc.countryId && typeof doc.countryId === 'object') {
    result.country_name = doc.countryId.name || '';
    result.country_id = doc.countryId._id?.toString();
  }
  if (doc.stateId && typeof doc.stateId === 'object') {
    result.state_name = doc.stateId.name || '';
    result.state_id = doc.stateId._id?.toString();
  }
  if (doc.countyId && typeof doc.countyId === 'object') {
    result.county_name = doc.countyId.name || '';
    result.county_id = doc.countyId._id?.toString();
  }
  if (doc.academicYearId && typeof doc.academicYearId === 'object') {
    result.academic_year_name = doc.academicYearId.name || '';
    result.academic_year_id = doc.academicYearId._id?.toString();
  }
  if (doc.superintendentId && typeof doc.superintendentId === 'object') {
    result.superintendent_name = `${doc.superintendentId.firstName || ''} ${doc.superintendentId.lastName || ''}`.trim();
    result.superintendent_email = doc.superintendentId.email || '';
    result.superintendent_id = doc.superintendentId._id?.toString();
  }

  // Remove nested address/subscription/settings from default list response
  // These can be included in detail view if needed
  return result;
};

const POPULATE_REFS = [
  { path: 'countryId', select: 'name code' },
  { path: 'stateId', select: 'name code' },
  { path: 'countyId', select: 'name code' },
  { path: 'academicYearId', select: 'name' },
  { path: 'superintendentId', select: 'firstName lastName email' },
];

class DistrictService {
  /**
   * Create a district with a superintendent user account.
   * Uses a transaction to ensure atomicity.
   */
  async create(body, createdBy) {
    // Check for duplicate code
    const existing = await District.findOne({ code: body.code });
    if (existing) {
      const err = new Error('A district with this code already exists');
      err.statusCode = 409;
      throw err;
    }

    // Check if superintendent email already exists
    const emailExists = await User.findOne({ email: body.superintendent_email });
    if (emailExists) {
      const err = new Error('A user with this email already exists');
      err.statusCode = 409;
      throw err;
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Parse superintendent name into first/last
      const nameParts = body.superintendent_name.trim().split(/\s+/);
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

      // 1. Create the superintendent user
      const [user] = await User.create(
        [
          {
            firstName,
            lastName,
            email: body.superintendent_email,
            password: body.superintendent_password,
            roles: ['district_admin'],
            primaryRole: 'district_admin',
            status: 'active',
            createdBy,
          },
        ],
        { session }
      );

      // 2. Create the district
      const [district] = await District.create(
        [
          {
            name: body.name,
            code: body.code,
            academicYearId: body.academic_year_id,
            countryId: body.country_id,
            stateId: body.state_id,
            countyId: body.county_id,
            status: body.status || 'active',
            superintendentId: user._id,
            createdBy,
          },
        ],
        { session }
      );

      // 3. Link user to district
      await User.findByIdAndUpdate(
        user._id,
        { districtId: district._id },
        { session }
      );

      await session.commitTransaction();

      // Return populated district
      return this.getById(district._id);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async getAll(query) {
    const filter = {};
    if (query.status) filter.status = query.status;
    if (query.country_id) filter.countryId = query.country_id;
    if (query.state_id) filter.stateId = query.state_id;
    if (query.county_id) filter.countyId = query.county_id;
    if (query.academic_year_id) filter.academicYearId = query.academic_year_id;
    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { code: { $regex: query.search, $options: 'i' } },
      ];
    }

    const result = await paginate(District, filter, {
      page: query.page,
      limit: query.limit,
      sort: { name: 1 },
      populate: POPULATE_REFS,
    });

    return {
      data: result.data.map(toResponse),
      pagination: result.pagination,
    };
  }

  async getById(id) {
    const doc = await District.findById(id)
      .populate(POPULATE_REFS)
      .lean();
    if (!doc) return null;
    return toResponse(doc);
  }

  async update(id, body, updatedBy) {
    const district = await District.findById(id);
    if (!district) return null;

    // Update district fields
    const updateData = { updatedBy };
    if (body.name !== undefined) updateData.name = body.name;
    if (body.code !== undefined) updateData.code = body.code;
    if (body.academic_year_id !== undefined) updateData.academicYearId = body.academic_year_id;
    if (body.country_id !== undefined) updateData.countryId = body.country_id;
    if (body.state_id !== undefined) updateData.stateId = body.state_id;
    if (body.county_id !== undefined) updateData.countyId = body.county_id;
    if (body.status !== undefined) updateData.status = body.status;

    // Check for duplicate code
    if (body.code && body.code !== district.code) {
      const dup = await District.findOne({ code: body.code, _id: { $ne: id } });
      if (dup) {
        const err = new Error('A district with this code already exists');
        err.statusCode = 409;
        throw err;
      }
    }

    await District.findByIdAndUpdate(id, updateData, { runValidators: true });

    // Update superintendent if name/email provided
    if (district.superintendentId && (body.superintendent_name || body.superintendent_email)) {
      const superUpdate = {};
      if (body.superintendent_name) {
        const parts = body.superintendent_name.trim().split(/\s+/);
        superUpdate.firstName = parts[0];
        superUpdate.lastName = parts.length > 1 ? parts.slice(1).join(' ') : '';
      }
      if (body.superintendent_email) superUpdate.email = body.superintendent_email;
      superUpdate.updatedBy = updatedBy;

      await User.findByIdAndUpdate(district.superintendentId, superUpdate);
    }

    return this.getById(id);
  }

  async delete(id) {
    const doc = await District.findByIdAndDelete(id);
    return !!doc;
  }
}

export default new DistrictService();
