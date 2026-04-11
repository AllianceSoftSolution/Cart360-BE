// BACKEND/src/modules/countries/country.routes.js

import { Router } from 'express';
import countryController from './country.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/rbac.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import {
  createCountrySchema,
  updateCountrySchema,
  queryCountrySchema,
} from './country.validation.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.post(
  '/',
  authorize('super_admin'),
  validate(createCountrySchema),
  countryController.create
);

router.get(
  '/',
  authorize('super_admin', 'district_admin'),
  validate(queryCountrySchema, 'query'),
  countryController.getAll
);

router.get(
  '/:id',
  authorize('super_admin', 'district_admin'),
  countryController.getById
);

router.put(
  '/:id',
  authorize('super_admin'),
  validate(updateCountrySchema),
  countryController.update
);

router.delete(
  '/:id',
  authorize('super_admin'),
  countryController.delete
);

export default router;
