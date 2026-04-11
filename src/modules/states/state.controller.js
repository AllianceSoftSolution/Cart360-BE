// BACKEND/src/modules/states/state.controller.js

import stateService from './state.service.js';
import { sendSuccess, sendError } from '../../utils/response.js';

class StateController {
  async create(req, res, next) {
    try {
      const state = await stateService.create(req.body, req.user._id);
      return sendSuccess(res, 201, 'State created successfully', state);
    } catch (error) {
      if (error.statusCode) return sendError(res, error.statusCode, error.message);
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const result = await stateService.getAll(req.validatedQuery || req.query);
      return sendSuccess(res, 200, 'States fetched successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const state = await stateService.getById(req.params.id);
      if (!state) return sendError(res, 404, 'State not found');
      return sendSuccess(res, 200, 'State fetched successfully', state);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const state = await stateService.update(req.params.id, req.body, req.user._id);
      if (!state) return sendError(res, 404, 'State not found');
      return sendSuccess(res, 200, 'State updated successfully', state);
    } catch (error) {
      if (error.statusCode) return sendError(res, error.statusCode, error.message);
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const deleted = await stateService.delete(req.params.id);
      if (!deleted) return sendError(res, 404, 'State not found');
      return sendSuccess(res, 200, 'State deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default new StateController();
