// BACKEND/src/modules/countries/country.controller.js

import countryService from './country.service.js';
import { sendSuccess, sendError } from '../../utils/response.js';

class CountryController {
  async create(req, res, next) {
    try {
      const country = await countryService.create(req.body, req.user._id);
      return sendSuccess(res, 201, 'Country created successfully', country);
    } catch (error) {
      if (error.statusCode) return sendError(res, error.statusCode, error.message);
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const result = await countryService.getAll(req.validatedQuery || req.query);
      return sendSuccess(res, 200, 'Countries fetched successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const country = await countryService.getById(req.params.id);
      if (!country) return sendError(res, 404, 'Country not found');
      return sendSuccess(res, 200, 'Country fetched successfully', country);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const country = await countryService.update(req.params.id, req.body, req.user._id);
      if (!country) return sendError(res, 404, 'Country not found');
      return sendSuccess(res, 200, 'Country updated successfully', country);
    } catch (error) {
      if (error.statusCode) return sendError(res, error.statusCode, error.message);
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const deleted = await countryService.delete(req.params.id);
      if (!deleted) return sendError(res, 404, 'Country not found');
      return sendSuccess(res, 200, 'Country deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default new CountryController();
