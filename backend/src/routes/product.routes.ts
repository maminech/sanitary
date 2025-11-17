/**
 * Product Routes
 */

import { Router } from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getSimilarProducts,
} from '../controllers/product.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import {
  validate,
  createProductSchema,
  updateProductSchema,
} from '../middleware/validation.middleware';

const router = Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);
router.get('/:id/similar', getSimilarProducts);

// Protected routes - Suppliers only
router.post(
  '/',
  authenticate,
  authorize('SUPPLIER', 'ADMIN'),
  validate(createProductSchema),
  createProduct
);

router.put(
  '/:id',
  authenticate,
  authorize('SUPPLIER', 'ADMIN'),
  validate(updateProductSchema),
  updateProduct
);

router.delete(
  '/:id',
  authenticate,
  authorize('SUPPLIER', 'ADMIN'),
  deleteProduct
);

export default router;
