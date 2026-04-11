// BACKEND/src/modules/academic/academic-years/academicYear.service.js

import AcademicYear from './academicYear.model.js';
import { paginate } from '../../../utils/pagination.js';
import { formatDoc } from '../../../utils/helpers.js';

/**
 * Transform frontend snake_case to model camelCase fields.
 */
const toModel = (body) => {
  const data = {};
  if (body.name !== undefined) data.name = body.name;
  if (body.start_date !== undefined) data.startDate = new Date(body.start_date);
  if (body.end_date !== undefined) data.endDate = new Date(body.end_date);
  if (body.status !== undefined) data.status = body.status;
  if (body.terms !== undefined) {
    data.terms = body.terms.map((t) => ({
      name: t.value,
      startDate: t.start_date ? new Date(t.start_date) : undefined,
      endDate: t.end_date ? new Date(t.end_date) : undefined,
      type: 'semester',
    }));
  }
  return data;
};

/**
 * Transform model camelCase to frontend snake_case response.
 */
const toResponse = (doc) => {
  const obj = typeof doc.toObject === 'function' ? doc.toObject() : { ...doc };

  return {
    id: obj._id?.toString?.() || obj._id,
    name: obj.name,
    start_date: obj.startDate ? obj.startDate.toISOString().split('T')[0] : '',
    end_date: obj.endDate ? obj.endDate.toISOString().split('T')[0] : '',
    status: obj.status,
    is_current: obj.isCurrent || false,
    terms: (obj.terms || []).map((t) => ({
      value: t.name || '',
      start_date: t.startDate ? t.startDate.toISOString().split('T')[0] : '',
      end_date: t.endDate ? t.endDate.toISOString().split('T')[0] : '',
    })),
    created_at: obj.createdAt,
    updated_at: obj.updatedAt,
  };
};

class AcademicYearService {
  async create(body, userId) {
    const modelData = toModel(body);
    modelData.createdBy = userId;

    // Academic years without a district are system-wide (super_admin creates)
    // The model requires districtId — for super_admin, we allow null
    // Override: make districtId optional for super_admin use
    const doc = await AcademicYear.create(modelData);
    return toResponse(doc);
  }

  async getAll(query) {
    const filter = {};
    if (query.status) filter.status = query.status;
    if (query.search) {
      filter.name = { $regex: query.search, $options: 'i' };
    }

    const result = await paginate(AcademicYear, filter, {
      page: query.page,
      limit: query.limit,
      sort: { createdAt: -1 },
    });

    return {
      data: result.data.map(toResponse),
      pagination: result.pagination,
    };
  }

  async getById(id) {
    const doc = await AcademicYear.findById(id).lean();
    if (!doc) return null;
    return toResponse(doc);
  }

  async update(id, body, userId) {
    const modelData = toModel(body);
    modelData.updatedBy = userId;

    // If setting as current, unset other current academic years
    if (body.status === 'active') {
      await AcademicYear.updateMany(
        { _id: { $ne: id }, isCurrent: true },
        { isCurrent: false }
      );
      modelData.isCurrent = true;
    }

    const doc = await AcademicYear.findByIdAndUpdate(id, modelData, {
      new: true,
      runValidators: true,
    }).lean();

    return doc ? toResponse(doc) : null;
  }

  async delete(id) {
    const doc = await AcademicYear.findByIdAndDelete(id);
    return !!doc;
  }
}

export default new AcademicYearService();
