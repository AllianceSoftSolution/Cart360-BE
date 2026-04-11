import districtService from './district.service.js';
import { sendSuccess, sendError } from '../../utils/response.js';

class DistrictController {
  async create(req, res, next) {
    try {
      const district = await districtService.create(req.body, req.user.id);
      return sendSuccess(res, 201, 'District created successfully', district);
    } catch (error) {
      if (error.statusCode) return sendError(res, error.statusCode, error.message);
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const result = await districtService.getAll(req.validatedQuery || req.query);
      return sendSuccess(res, 200, 'Districts retrieved successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const district = await districtService.getById(req.params.id);
      if (!district) return sendError(res, 404, 'District not found');
      return sendSuccess(res, 200, 'District retrieved successfully', district);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const district = await districtService.update(req.params.id, req.body, req.user.id);
      if (!district) return sendError(res, 404, 'District not found');
      return sendSuccess(res, 200, 'District updated successfully', district);
    } catch (error) {
      if (error.statusCode) return sendError(res, error.statusCode, error.message);
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const deleted = await districtService.delete(req.params.id);
      if (!deleted) return sendError(res, 404, 'District not found');
      return sendSuccess(res, 200, 'District deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default new DistrictController();
