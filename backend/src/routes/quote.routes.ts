/**
 * Quote Routes
 */

import { Router } from 'express';
import {
  createQuoteFromPlan,
  getQuotes,
  getQuoteById,
  updateQuote,
  addQuoteItem,
  updateQuoteItem,
  deleteQuoteItem,
} from '../controllers/quote.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate, updateQuoteItemSchema } from '../middleware/validation.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Quote routes
router.post('/from-plan', createQuoteFromPlan);
router.get('/', getQuotes);
router.get('/:id', getQuoteById);
router.put('/:id', updateQuote);

// Quote item routes
router.post('/:id/items', addQuoteItem);
router.put('/:id/items/:itemId', validate(updateQuoteItemSchema), updateQuoteItem);
router.delete('/:id/items/:itemId', deleteQuoteItem);

export default router;
