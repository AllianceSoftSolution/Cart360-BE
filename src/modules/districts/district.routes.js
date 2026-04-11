import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/rbac.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import {
  createDistrictSchema,
  updateDistrictSchema,
  queryDistrictSchema,
} from './district.validation.js';
import districtController from './district.controller.js';

const router = Router();

router.use(authenticate);

router
  .route('/')
  .post(
    authorize('super_admin'),
    validate(createDistrictSchema),
    districtController.create.bind(districtController)
  )
  .get(
    authorize('super_admin', 'district_admin'),
    validate(queryDistrictSchema, 'query'),
    districtController.getAll.bind(districtController)
  );

router
  .route('/:id')
  .get(
    authorize('super_admin', 'district_admin'),
    districtController.getById.bind(districtController)
  )
  .put(
    authorize('super_admin'),
    validate(updateDistrictSchema),
    districtController.update.bind(districtController)
  )
  .delete(
    authorize('super_admin'),
    districtController.delete.bind(districtController)
  );

export default router;
