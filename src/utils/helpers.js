// BACKEND/src/utils/helpers.js

/**
 * Convert object keys from snake_case to camelCase.
 * Only processes top-level keys.
 */
export const snakeToCamel = (obj) => {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj;
  const result = {};
  for (const [key, val] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    result[camelKey] = val;
  }
  return result;
};

/**
 * Convert object keys from camelCase to snake_case.
 * Only processes top-level keys.
 */
export const camelToSnake = (obj) => {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj;
  const result = {};
  for (const [key, val] of Object.entries(obj)) {
    const snakeKey = key.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
    result[snakeKey] = val;
  }
  return result;
};

/**
 * Format a Mongoose document for API response.
 * Converts _id → id, removes __v, and converts specified ref fields to snake_case.
 */
export const formatDoc = (doc, refMap = {}) => {
  if (!doc) return null;
  const obj = typeof doc.toObject === 'function' ? doc.toObject() : { ...doc };

  obj.id = obj._id?.toString?.() || obj._id;
  delete obj._id;
  delete obj.__v;

  // Map camelCase ref fields to snake_case
  for (const [camel, snake] of Object.entries(refMap)) {
    if (obj[camel] !== undefined) {
      obj[snake] = obj[camel]?.toString?.() || obj[camel];
      delete obj[camel];
    }
  }

  return obj;
};

/**
 * Format an array of docs.
 */
export const formatDocs = (docs, refMap = {}) => {
  return docs.map((d) => formatDoc(d, refMap));
};