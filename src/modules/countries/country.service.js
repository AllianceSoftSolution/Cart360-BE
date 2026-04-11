// BACKEND/src/modules/countries/country.service.js

import Country from './country.model.js';
import { paginate } from '../../utils/pagination.js';
import { formatDoc, formatDocs } from '../../utils/helpers.js';

// Field mapping: frontend snake_case → model camelCase
const REF_MAP = { academicYearId: 'academic_year_id' };

class CountryService {
  /**
   * Create a new country.
   */
  async create(body, userId) {
    const exists = await Country.findOne({
      code: body.code,
      academicYearId: body.academic_year_id,
    });
    if (exists) {
      const err = new Error('A country with this code already exists for the selected academic year');
      err.statusCode = 409;
      throw err;
    }

    const doc = await Country.create({
      name: body.name,
      code: body.code,
      academicYearId: body.academic_year_id,
      status: body.status || 'active',
      createdBy: userId,
    });

    return formatDoc(doc, REF_MAP);
  }

  /**
   * Get all countries with pagination + filters.
   */
  async getAll(query) {
    const filter = {};
    if (query.status) filter.status = query.status;
    if (query.academic_year_id) filter.academicYearId = query.academic_year_id;
    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { code: { $regex: query.search, $options: 'i' } },
      ];
    }

    const result = await paginate(Country, filter, {
      page: query.page,
      limit: query.limit,
      sort: { name: 1 },
    });

    return {
      data: formatDocs(result.data, REF_MAP),
      pagination: result.pagination,
    };
  }

  /**
   * Get a single country by ID.
   */
  async getById(id) {
    const doc = await Country.findById(id).lean();
    if (!doc) return null;
    return formatDoc(doc, REF_MAP);
  }

  /**
   * Update a country.
   */
  async update(id, body, userId) {
    const updateData = { updatedBy: userId };
    if (body.name !== undefined) updateData.name = body.name;
    if (body.code !== undefined) updateData.code = body.code;
    if (body.academic_year_id !== undefined) updateData.academicYearId = body.academic_year_id;
    if (body.status !== undefined) updateData.status = body.status;

    // Check for duplicate code within the same academic year
    if (body.code || body.academic_year_id) {
      const existing = await Country.findById(id);
      if (!existing) return null;

      const checkCode = body.code || existing.code;
      const checkYear = body.academic_year_id || existing.academicYearId?.toString();

      const dup = await Country.findOne({
        _id: { $ne: id },
        code: checkCode,
        academicYearId: checkYear,
      });
      if (dup) {
        const err = new Error('A country with this code already exists for the selected academic year');
        err.statusCode = 409;
        throw err;
      }
    }

    const doc = await Country.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).lean();

    return doc ? formatDoc(doc, REF_MAP) : null;
  }

  /**
   * Delete a country.
   */
  async delete(id) {
    const doc = await Country.findByIdAndDelete(id);
    return !!doc;
  }
}

export default new CountryService();
