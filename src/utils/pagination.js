// BACKEND/src/utils/pagination.js

/**
 * Reusable pagination helper for Mongoose queries.
 * Returns { data, pagination } matching the sendSuccess format.
 */
export const paginate = async (Model, filter = {}, options = {}) => {
  const {
    page = 1,
    limit = 25,
    sort = { createdAt: -1 },
    populate = '',
    select = '',
  } = options;

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 25));
  const skip = (pageNum - 1) * limitNum;

  const [data, total] = await Promise.all([
    Model.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .populate(populate)
      .select(select)
      .lean(),
    Model.countDocuments(filter),
  ]);

  return {
    data,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
      hasNext: pageNum < Math.ceil(total / limitNum),
      hasPrev: pageNum > 1,
    },
  };
};