import { Router } from 'express';
import authController from '../controllers/authController';
import { registerValidation, loginValidation } from '../validators/authValidators';
import { handleValidationErrors } from '../middlewares/validationMiddleware';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
  '/register',
  registerValidation,
  handleValidationErrors,
  authController.register
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post(
  '/login',
  loginValidation,
  handleValidationErrors,
  authController.login
);

// @route   GET /api/auth/profile
// @desc    Get user profile
// @access  Private
router.get(
  '/profile',
  authenticate,
  authController.getProfile
);

export default router;