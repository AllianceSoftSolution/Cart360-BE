// BACKEND/src/modules/counties/county.controller.js

import countyService from './county.service.js';
import { sendSuccess, sendError } from '../../utils/response.js';

class CountyController {
  async create(req, res, next) {
    try {
      const county = await countyService.create(req.body, req.user._id);
      return sendSuccess(res, 201, 'County created successfully', county);
    } catch (error) {
      if (error.statusCode) return sendError(res, error.statusCode, error.message);
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const result = await countyService.getAll(req.validatedQuery || req.query);
      return sendSuccess(res, 200, 'Counties fetched successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const county = await countyService.getById(req.params.id);
      if (!county) return sendError(res, 404, 'County not found');
      return sendSuccess(res, 200, 'County fetched successfully', county);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const county = await countyService.update(req.params.id, req.body, req.user._id);
      if (!county) return sendError(res, 404, 'County not found');
      return sendSuccess(res, 200, 'County updated successfully', county);
    } catch (error) {
      if (error.statusCode) return sendError(res, error.statusCode, error.message);
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const deleted = await countyService.delete(req.params.id);
      if (!deleted) return sendError(res, 404, 'County not found');
      return sendSuccess(res, 200, 'County deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default new CountyController();
