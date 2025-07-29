import { body, param, query } from 'express-validator';

export const createContactValidation = [
  body('name')
    .isString()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .trim(),
  
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('phone')
    .optional()
    .matches(/^[\+]?[\d\s\-\(\)]{10,}$/)
    .withMessage('Please provide a valid phone number')
    .trim()
];

export const updateContactValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid contact ID'),
  
  body('name')
    .optional()
    .isString()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .trim(),
  
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('phone')
    .optional()
    .matches(/^[\+]?[\d\s\-\(\)]{10,}$/)
    .withMessage('Please provide a valid phone number')
    .trim()
];

export const addNoteValidation = [
  param('contactId')
    .isMongoId()
    .withMessage('Invalid contact ID'),
  
  body('content')
    .isString()
    .notEmpty()
    .withMessage('Note content is required')
    .isLength({ min: 1, max: 2000 })
    .withMessage('Note content must be between 1 and 2000 characters')
    .trim(),
  
  body('type')
    .optional()
    .isIn(['call', 'meeting', 'email', 'general'])
    .withMessage('Note type must be one of: call, meeting, email, general'),
  
  body('isPrivate')
    .optional()
    .isBoolean()
    .withMessage('isPrivate must be a boolean value')
];

export const getContactValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid contact ID')
];

export const listContactsValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('search')
    .optional()
    .isString()
    .trim(),
  
  query('status')
    .optional()
    .isIn(['active', 'inactive', 'archived'])
    .withMessage('Status must be one of: active, inactive, archived'),
  
  query('sortBy')
    .optional()
    .isIn(['name', 'email', 'createdAt', 'updatedAt'])
    .withMessage('SortBy must be one of: name, email, createdAt, updatedAt'),
  
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('SortOrder must be either asc or desc')
];
