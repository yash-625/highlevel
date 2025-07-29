import { Router } from 'express';
import contactController from '../controllers/contactController';
import { authenticate } from '../middlewares/authMiddleware';
import { handleValidationErrors } from '../middlewares/validationMiddleware';
import {
  createContactValidation,
  updateContactValidation,
  addNoteValidation,
  getContactValidation,
  listContactsValidation
} from '../validators/contactValidators';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Contact CRUD routes
router.post(
  '/',
  createContactValidation,
  handleValidationErrors,
  contactController.createContact
);

router.get(
  '/',
  listContactsValidation,
  handleValidationErrors,
  contactController.listContacts
);

router.get(
  '/:id',
  getContactValidation,
  handleValidationErrors,
  contactController.getContact
);

router.put(
  '/:id',
  updateContactValidation,
  handleValidationErrors,
  contactController.updateContact
);

router.delete(
  '/:id',
  getContactValidation,
  handleValidationErrors,
  contactController.deleteContact
);

// Notes routes
router.post(
  '/:contactId/notes',
  addNoteValidation,
  handleValidationErrors,
  contactController.addNote
);

// Audit logs route
router.get(
  '/:contactId/audit-logs',
  getContactValidation,
  handleValidationErrors,
  contactController.getContactAuditLogs
);

export default router;
