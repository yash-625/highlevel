import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, ApiResponse, CreateContactRequest, AddNoteRequest } from '../types/auth';
import contactService from '../services/contactService';
import { AppError } from '../middlewares/errorMiddleware';

class ContactController {
  /**
   * Create a new contact
   * POST /api/v1/contacts
   */
  async createContact(
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const contactData: CreateContactRequest = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone
      };

      const auditContext = {
        organizationId: req.user.organizationId._id.toString(),
        performedBy: req.user._id.toString(),
        performedByName: req.user.name,
        ...(req.ip && { ipAddress: req.ip }),
        ...(req.get('User-Agent') && {userAgent: req.get('User-Agent')}),
        description: 'Contact created via API'
      } as any;

      const contact = await contactService.createContact(contactData, auditContext);

      res.status(201).json({
        success: true,
        message: 'Contact created successfully',
        data: contact
      });

    } catch (error) {
      next(error);
    }
  }

  /**
   * Get contact by ID
   * GET /api/v1/contacts/:id
   */
  async getContact(
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const contactId = req.params.id as string;
      const organizationId = req.user.organizationId._id.toString();

      const contact = await contactService.getContactById(contactId, organizationId);

      res.status(200).json({
        success: true,
        message: 'Contact retrieved successfully',
        data: contact
      });

    } catch (error) {
      next(error);
    }
  }

  /**
   * Update contact
   * PUT /api/v1/contacts/:id
   */
  async updateContact(
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const contactId = req.params.id as string;
      const updateData: Partial<CreateContactRequest> = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone
      };

      // Remove undefined fields
      Object.keys(updateData).forEach(key => {
        if (updateData[key as keyof CreateContactRequest] === undefined) {
          delete updateData[key as keyof CreateContactRequest];
        }
      });

      const auditContext = {
        organizationId: req.user.organizationId._id.toString(),
        performedBy: req.user._id.toString(),
        performedByName: req.user.name,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
        description: 'Contact updated via API'
      } as any;

      const contact = await contactService.updateContact(contactId, updateData, auditContext);

      res.status(200).json({
        success: true,
        message: 'Contact updated successfully',
        data: contact
      });

    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete contact
   * DELETE /api/v1/contacts/:id
   */
  async deleteContact(
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const contactId = req.params.id as string;
      const auditContext = {
        organizationId: req.user.organizationId._id.toString(),
        performedBy: req.user._id.toString(),
        performedByName: req.user.name,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
        description: 'Contact deleted via API'
      } as any;

      const result = await contactService.deleteContact(contactId, auditContext);

      res.status(200).json({
        success: true,
        message: 'Contact deleted successfully',
        data: result
      });

    } catch (error) {
      next(error);
    }
  }

  /**
   * Add note to contact
   * POST /api/v1/contacts/:contactId/notes
   */
  async addNote(
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const contactId = req.params.contactId as string;
      const noteData: AddNoteRequest = {
        content: req.body.content,
        type: req.body.type,
        isPrivate: req.body.isPrivate
      };

      const auditContext = {
        organizationId: req.user.organizationId._id.toString(),
        performedBy: req.user._id.toString(),
        performedByName: req.user.name,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
        description: 'Note added to contact via API'
      } as any;

      const contact = await contactService.addNoteToContact(contactId, noteData, auditContext);

      res.status(201).json({
        success: true,
        message: 'Note added successfully',
        data: {
          contact: {
            _id: contact._id,
            name: contact.name,
            notes: contact.notes,
            updatedAt: contact.updatedAt
          }
        }
      });

    } catch (error) {
      next(error);
    }
  }

  /**
   * List contacts with pagination
   * GET /api/v1/contacts
   */
  async listContacts(
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const organizationId = req.user.organizationId._id.toString();
      const options = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20,
        search: req.query.search as string || '',
        status: req.query.status as string || 'active',
        sortBy: req.query.sortBy as string || 'createdAt',
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc'
      };

      const result = await contactService.listContacts(organizationId, options);

      res.status(200).json({
        success: true,
        message: 'Contacts retrieved successfully',
        data: result.contacts,
        pagination: result.pagination
      });

    } catch (error) {
      next(error);
    }
  }

  /**
   * Get contact audit logs
   * GET /api/v1/contacts/:contactId/audit-logs
   */
  async getContactAuditLogs(
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const contactId = req.params.id as string;
      const organizationId = req.user.organizationId._id.toString();
      const options = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20
      };

      const result = await contactService.getContactAuditLogs(contactId, organizationId, options);

      res.status(200).json({
        success: true,
        message: 'Audit logs retrieved successfully',
        data: result.auditLogs,
        pagination: result.pagination
      });

    } catch (error) {
      next(error);
    }
  }
}

export default new ContactController();
