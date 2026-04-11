// BACKEND/src/modules/counties/county.validation.js

import Joi from 'joi';

const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

export const createCountySchema = Joi.object({
  name: Joi.string().trim().min(1).max(100).required().messages({
    'string.empty': 'County name is required',
    'any.required': 'County name is required',
  }),
  code: Joi.string().trim().min(1).max(10).uppercase().required().messages({
    'string.empty': 'County code is required',
    'any.required': 'County code is required',
  }),
  country_id: objectId.required().messages({
    'string.pattern.base': 'Invalid country ID',
    'any.required': 'Country is required',
  }),
  state_id: objectId.required().messages({
    'string.pattern.base': 'Invalid state ID',
    'any.required': 'State is required',
  }),
  academic_year_id: objectId.required().messages({
    'string.pattern.base': 'Invalid academic year ID',
    'any.required': 'Academic year is required',
  }),
  status: Joi.string().valid('active', 'inactive').default('active'),
});

export const updateCountySchema = Joi.object({
  name: Joi.string().trim().min(1).max(100),
  code: Joi.string().trim().min(1).max(10).uppercase(),
  country_id: objectId.messages({ 'string.pattern.base': 'Invalid country ID' }),
  state_id: objectId.messages({ 'string.pattern.base': 'Invalid state ID' }),
  academic_year_id: objectId.messages({ 'string.pattern.base': 'Invalid academic year ID' }),
  status: Joi.string().valid('active', 'inactive'),
}).min(1).messages({
  'object.min': 'At least one field is required for update',
});

export const queryCountySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(25),
  status: Joi.string().valid('active', 'inactive'),
  country_id: objectId,
  state_id: objectId,
  academic_year_id: objectId,
  search: Joi.string().trim().max(100),
});
