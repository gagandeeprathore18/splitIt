import { Router } from 'express';
import {
  signup,
  login,
  getMe,
  searchUsers,
  signupValidation,
  loginValidation,
} from '../controllers/authController.js';
import protect from '../middleware/authMiddleware.js';
import sanitize from '../middleware/sanitize.js';

const router = Router();

// Apply sanitisation to all auth routes
router.use(sanitize);

// Public routes
router.post('/signup', signupValidation, signup);
router.post('/login', loginValidation, login);

// Protected routes
router.get('/me', protect, getMe);
router.get('/users/search', protect, searchUsers);

export default router;
