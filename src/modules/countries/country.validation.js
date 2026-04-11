// BACKEND/src/modules/countries/country.validation.js

import Joi from 'joi';

export const createCountrySchema = Joi.object({
  name: Joi.string().trim().min(1).max(100).required().messages({
    'string.empty': 'Country name is required',
    'string.max': 'Country name cannot exceed 100 characters',
    'any.required': 'Country name is required',
  }),
  code: Joi.string().trim().min(2).max(5).uppercase().required().messages({
    'string.empty': 'Country code is required',
    'string.min': 'Country code must be at least 2 characters',
    'string.max': 'Country code cannot exceed 5 characters',
    'any.required': 'Country code is required',
  }),
  academic_year_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid academic year ID',
      'any.required': 'Academic year is required',
    }),
  status: Joi.string().valid('active', 'inactive').default('active'),
});

export const updateCountrySchema = Joi.object({
  name: Joi.string().trim().min(1).max(100).messages({
    'string.empty': 'Country name cannot be empty',
    'string.max': 'Country name cannot exceed 100 characters',
  }),
  code: Joi.string().trim().min(2).max(5).uppercase().messages({
    'string.min': 'Country code must be at least 2 characters',
    'string.max': 'Country code cannot exceed 5 characters',
  }),
  academic_year_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.pattern.base': 'Invalid academic year ID',
    }),
  status: Joi.string().valid('active', 'inactive'),
}).min(1).messages({
  'object.min': 'At least one field is required for update',
});

export const queryCountrySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(25),
  status: Joi.string().valid('active', 'inactive'),
  academic_year_id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
  search: Joi.string().trim().max(100),
});
