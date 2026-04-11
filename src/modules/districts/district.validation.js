// BACKEND/src/modules/districts/district.validation.js

import Joi from 'joi';

const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

export const createDistrictSchema = Joi.object({
  name: Joi.string().trim().min(1).max(200).required().messages({
    'string.empty': 'District name is required',
    'any.required': 'District name is required',
  }),
  code: Joi.string().trim().min(1).max(20).uppercase().required().messages({
    'string.empty': 'District code is required',
    'any.required': 'District code is required',
  }),
  academic_year_id: objectId.required().messages({
    'string.pattern.base': 'Invalid academic year ID',
    'any.required': 'Academic year is required',
  }),
  country_id: objectId.required().messages({
    'string.pattern.base': 'Invalid country ID',
    'any.required': 'Country is required',
  }),
  state_id: objectId.required().messages({
    'string.pattern.base': 'Invalid state ID',
    'any.required': 'State is required',
  }),
  county_id: objectId.required().messages({
    'string.pattern.base': 'Invalid county ID',
    'any.required': 'County is required',
  }),
  status: Joi.string().valid('active', 'inactive', 'suspended', 'trial').default('active'),

  // Superintendent fields
  superintendent_name: Joi.string().trim().min(1).max(100).required().messages({
    'string.empty': 'Superintendent name is required',
    'any.required': 'Superintendent name is required',
  }),
  superintendent_email: Joi.string().email().required().messages({
    'string.email': 'Valid superintendent email is required',
    'any.required': 'Superintendent email is required',
  }),
  superintendent_password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters',
    'any.required': 'Superintendent password is required',
  }),
});

export const updateDistrictSchema = Joi.object({
  name: Joi.string().trim().min(1).max(200),
  code: Joi.string().trim().min(1).max(20).uppercase(),
  academic_year_id: objectId,
  country_id: objectId,
  state_id: objectId,
  county_id: objectId,
  status: Joi.string().valid('active', 'inactive', 'suspended', 'trial'),
  superintendent_name: Joi.string().trim().min(1).max(100),
  superintendent_email: Joi.string().email(),
}).min(1).messages({
  'object.min': 'At least one field is required for update',
});

export const queryDistrictSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(25),
  status: Joi.string().valid('active', 'inactive', 'suspended', 'trial'),
  county_id: objectId,
  state_id: objectId,
  country_id: objectId,
  academic_year_id: objectId,
  search: Joi.string().trim().max(100),
});
