// BACKEND/src/modules/academic/academic-years/academicYear.validation.js

import Joi from 'joi';

const termSchema = Joi.object({
  value: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Term name is required',
    'any.required': 'Term name is required',
  }),
  start_date: Joi.string().allow('').optional(),
  end_date: Joi.string().allow('').optional(),
});

export const createAcademicYearSchema = Joi.object({
  name: Joi.string().trim().min(1).max(50).required().messages({
    'string.empty': 'Academic year name is required',
    'any.required': 'Academic year name is required',
  }),
  start_date: Joi.string().min(1).required().messages({
    'string.empty': 'Start date is required',
    'any.required': 'Start date is required',
  }),
  end_date: Joi.string().min(1).required().messages({
    'string.empty': 'End date is required',
    'any.required': 'End date is required',
  }),
  status: Joi.string().valid('planning', 'active', 'completed', 'archived').default('planning'),
  terms: Joi.array().items(termSchema).optional().default([]),
});

export const updateAcademicYearSchema = Joi.object({
  name: Joi.string().trim().min(1).max(50),
  start_date: Joi.string().min(1),
  end_date: Joi.string().min(1),
  status: Joi.string().valid('planning', 'active', 'completed', 'archived'),
  terms: Joi.array().items(termSchema).optional(),
}).min(1).messages({
  'object.min': 'At least one field is required for update',
});

export const queryAcademicYearSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(25),
  status: Joi.string().valid('planning', 'active', 'completed', 'archived'),
  search: Joi.string().trim().max(100),
});
