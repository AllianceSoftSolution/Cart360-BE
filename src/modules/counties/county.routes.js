// BACKEND/src/modules/counties/county.routes.js

import { Router } from 'express';
import countyController from './county.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/rbac.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import {
  createCountySchema,
  updateCountySchema,
  queryCountySchema,
} from './county.validation.js';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  authorize('super_admin'),
  validate(createCountySchema),
  countyController.create
);

router.get(
  '/',
  authorize('super_admin', 'district_admin'),
  validate(queryCountySchema, 'query'),
  countyController.getAll
);

router.get(
  '/:id',
  authorize('super_admin', 'district_admin'),
  countyController.getById
);

router.put(
  '/:id',
  authorize('super_admin'),
  validate(updateCountySchema),
  countyController.update
);

router.delete(
  '/:id',
  authorize('super_admin'),
  countyController.delete
);

export default router;
