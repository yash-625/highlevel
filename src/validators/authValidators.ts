import { body } from 'express-validator';

export const registerValidation = [
  body('username')
    .isString()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores')
    .trim()
    .toLowerCase(),

  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('name')
    .isString()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .trim(),

  body('password')
    .isString()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),

  body('organizationName')
    .isString()
    .notEmpty()
    .withMessage('Organization name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Organization name must be between 2 and 100 characters')
    .trim()
];

export const loginValidation = [
  body('username')
    .isString()
    .notEmpty()
    .withMessage('Username or email is required')
    .trim(),

  body('password')
    .isString()
    .notEmpty()
    .withMessage('Password is required')
];

