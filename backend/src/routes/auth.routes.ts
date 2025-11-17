/**
 * Authentication Routes
 */

import { Router } from 'express';
import {
  register,
  login,
  refresh,
  logout,
  getProfile,
  updateProfile,
} from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate, registerSchema, loginSchema } from '../middleware/validation.middleware';

const router = Router();

// Public routes
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', refresh);

// Protected routes
router.post('/logout', authenticate, logout);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);

export default router;
