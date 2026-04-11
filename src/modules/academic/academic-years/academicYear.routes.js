// BACKEND/src/modules/academic/academic-years/academicYear.routes.js

import { Router } from 'express';
import academicYearController from './academicYear.controller.js';
import { authenticate } from '../../../middlewares/auth.middleware.js';
import { authorize } from '../../../middlewares/rbac.middleware.js';
import { validate } from '../../../middlewares/validate.middleware.js';
import {
  createAcademicYearSchema,
  updateAcademicYearSchema,
  queryAcademicYearSchema,
} from './academicYear.validation.js';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  authorize('super_admin', 'district_admin'),
  validate(createAcademicYearSchema),
  academicYearController.create
);

router.get(
  '/',
  authorize('super_admin', 'district_admin', 'school_admin'),
  validate(queryAcademicYearSchema, 'query'),
  academicYearController.getAll
);

router.get(
  '/:id',
  authorize('super_admin', 'district_admin', 'school_admin'),
  academicYearController.getById
);

router.put(
  '/:id',
  authorize('super_admin', 'district_admin'),
  validate(updateAcademicYearSchema),
  academicYearController.update
);

router.delete(
  '/:id',
  authorize('super_admin'),
  academicYearController.delete
);

export default router;
