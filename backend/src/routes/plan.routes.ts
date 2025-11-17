/**
 * Plan Routes
 */

import { Router } from 'express';
import {
  uploadPlan,
  getPlans,
  getPlanById,
  updatePlan,
  deletePlan,
  getDetectedProducts,
} from '../controllers/plan.controller';
import { authenticate } from '../middleware/auth.middleware';
import { uploadPresets } from '../config/multer';
import { validate, updatePlanSchema } from '../middleware/validation.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Plan routes
router.post('/upload', uploadPresets.plan, uploadPlan);
router.get('/', getPlans);
router.get('/:id', getPlanById);
router.put('/:id', validate(updatePlanSchema), updatePlan);
router.delete('/:id', deletePlan);

// Detected products
router.get('/:id/products', getDetectedProducts);

export default router;
