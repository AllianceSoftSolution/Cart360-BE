// BACKEND/src/modules/states/state.routes.js

import { Router } from 'express';
import stateController from './state.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/rbac.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import {
  createStateSchema,
  updateStateSchema,
  queryStateSchema,
} from './state.validation.js';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  authorize('super_admin'),
  validate(createStateSchema),
  stateController.create
);

router.get(
  '/',
  authorize('super_admin', 'district_admin'),
  validate(queryStateSchema, 'query'),
  stateController.getAll
);

router.get(
  '/:id',
  authorize('super_admin', 'district_admin'),
  stateController.getById
);

router.put(
  '/:id',
  authorize('super_admin'),
  validate(updateStateSchema),
  stateController.update
);

router.delete(
  '/:id',
  authorize('super_admin'),
  stateController.delete
);

export default router;
