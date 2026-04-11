// BACKEND/src/modules/academic/academic-years/academicYear.controller.js

import academicYearService from './academicYear.service.js';
import { sendSuccess, sendError } from '../../../utils/response.js';

class AcademicYearController {
  async create(req, res, next) {
    try {
      const year = await academicYearService.create(req.body, req.user._id);
      return sendSuccess(res, 201, 'Academic year created successfully', year);
    } catch (error) {
      if (error.statusCode) return sendError(res, error.statusCode, error.message);
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const result = await academicYearService.getAll(req.validatedQuery || req.query);
      return sendSuccess(res, 200, 'Academic years fetched successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const year = await academicYearService.getById(req.params.id);
      if (!year) return sendError(res, 404, 'Academic year not found');
      return sendSuccess(res, 200, 'Academic year fetched successfully', year);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const year = await academicYearService.update(req.params.id, req.body, req.user._id);
      if (!year) return sendError(res, 404, 'Academic year not found');
      return sendSuccess(res, 200, 'Academic year updated successfully', year);
    } catch (error) {
      if (error.statusCode) return sendError(res, error.statusCode, error.message);
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const deleted = await academicYearService.delete(req.params.id);
      if (!deleted) return sendError(res, 404, 'Academic year not found');
      return sendSuccess(res, 200, 'Academic year deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default new AcademicYearController();
