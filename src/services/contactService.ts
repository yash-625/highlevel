import mongoose from 'mongoose';
import Contact, { IContact } from '../models/Contact';
import AuditLog from '../models/AuditLog';
import { AppError } from '../middlewares/errorMiddleware';
import { CreateContactRequest, AddNoteRequest } from '../types/auth';

interface AuditContext {
  organizationId: string;
  performedBy: string;
  performedByName: string;
  ipAddress?: string;
  userAgent?: string;
  description?: string;
}

class ContactService {
  /**
   * Create contact with audit logging using MongoDB transaction
   */
  async createContact(
    contactData: CreateContactRequest,
    auditContext: AuditContext
  ): Promise<IContact> {
    // const session = await mongoose.startSession();

    try {
    //   const result = await session.withTransaction(async () => {
        const { name, email, phone } = contactData;

        // Check for duplicate email within organization
        if (phone) {
          const existingContact = await Contact.findOne({
            organizationId: auditContext.organizationId,
            phone: phone,
            status: { $ne: 'archived' }
          });

          if (existingContact) {
            throw new AppError('Phone already exists in your organization', 409);
          }
        }

        // Create contact
        const contact = await Contact.create([{
          name: name.trim(),
          email: email?.toLowerCase(),
          phone: phone?.trim(),
          organizationId: auditContext.organizationId,
          createdBy: auditContext.performedBy,
          createdByName: auditContext.performedByName,
          status: 'active',
          notes: []
        }]);

        if (!contact || contact.length === 0) {
          throw new AppError('Failed to create contact', 500);
        }

        // Create audit log
        await AuditLog.create([{
          organizationId: auditContext.organizationId,
          entityType: 'contact',
          entityId: contact[0]?._id,
          action: 'create',
          changes: {
            new: {
              name: contact[0]?.name,
              email: contact[0]?.email,
              phone: contact[0]?.phone,
              status: contact[0]?.status
            }
          },
          performedBy: auditContext.performedBy,
          performedByName: auditContext.performedByName,
          metadata: {
            ipAddress: auditContext.ipAddress,
            userAgent: auditContext.userAgent,
            description: auditContext.description || 'Contact created'
          },
          timestamp: new Date()
        }]);

        return contact[0] as any;
    //   });

    //   return result as any;

    } catch (error) {
      console.error('Contact creation error:', error);
      throw error;
    } finally {
    //   await session.endSession();
    }
  }

  /**
   * Get contact by ID with organization validation
   */
  async getContactById(contactId: string, organizationId: string): Promise<IContact> {
    const contact = await Contact.findOne({
      _id: contactId,
      organizationId: organizationId,
      status: { $ne: 'archived' }
    });

    if (!contact) {
      throw new AppError('Contact not found', 404);
    }

    return contact;
  }

  /**
   * Update contact with audit logging using MongoDB transaction
   */
  async updateContact(
    contactId: string,
    updateData: Partial<CreateContactRequest>,
    auditContext: AuditContext
  ): Promise<IContact> {
    // const session = await mongoose.startSession();

    try {
    //   const result = await session.withTransaction(async () => {
        // Get original contact
        const originalContact = await Contact.findOne({
          _id: contactId,
          organizationId: auditContext.organizationId,
          status: { $ne: 'archived' }
        });

        if (!originalContact) {
          throw new AppError('Contact not found', 404);
        }

        // Store original values for audit
        const originalValues = {
          name: originalContact.name,
          email: originalContact.email,
          phone: originalContact.phone
        };

        // Check for duplicate email if email is being updated
        if (updateData.email && updateData.email !== originalContact.email) {
          const existingContact = await Contact.findOne({
            organizationId: auditContext.organizationId,
            email: updateData.email.toLowerCase(),
            _id: { $ne: contactId },
            status: { $ne: 'archived' }
          });

          if (existingContact) {
            throw new AppError('Email already exists in your organization', 409);
          }
        }

        // Update contact
        const updatedFields: any = {};
        if (updateData.name !== undefined) updatedFields.name = updateData.name.trim();
        if (updateData.email !== undefined) updatedFields.email = updateData.email.toLowerCase();
        if (updateData.phone !== undefined) updatedFields.phone = updateData.phone.trim();
        
        updatedFields.lastModifiedBy = auditContext.performedBy;
        updatedFields.lastModifiedByName = auditContext.performedByName;

        const updatedContact = await Contact.findByIdAndUpdate(
          contactId,
          updatedFields,
          { 
            new: true, 
            runValidators: true 
          }
        );

        if (!updatedContact) {
          throw new AppError('Failed to update contact', 500);
        }

        // Create audit log with before/after values
        const changes: any = { old: {}, new: {} };
        
        for (const [key, value] of Object.entries(updateData)) {
          if (value !== undefined && originalValues[key as keyof typeof originalValues] !== value) {
            changes.old[key] = originalValues[key as keyof typeof originalValues];
            changes.new[key] = value;
          }
        }

        // Only create audit log if something actually changed
        if (Object.keys(changes.old).length > 0) {
          await AuditLog.create([{
            organizationId: auditContext.organizationId,
            entityType: 'contact',
            entityId: contactId,
            action: 'update',
            changes,
            performedBy: auditContext.performedBy,
            performedByName: auditContext.performedByName,
            metadata: {
              ipAddress: auditContext.ipAddress,
              userAgent: auditContext.userAgent,
              description: auditContext.description || 'Contact updated'
            },
            timestamp: new Date()
          }]);
        }

        return updatedContact;
    //   });

    //   return result;

    } catch (error) {
      console.error('Contact update error:', error);
      throw error;
    } finally {
    //   await session.endSession();
    }
  }

  /**
   * Delete contact with audit logging using MongoDB transaction
   */
  async deleteContact(
    contactId: string,
    auditContext: AuditContext
  ): Promise<{ deletedId: string; deletedAt: Date }> {
    // const session = await mongoose.startSession();

    try {
    //   const result = await session.withTransaction(async () => {
        // Get contact to delete
        const contact = await Contact.findOne({
          _id: contactId,
          organizationId: auditContext.organizationId,
          status: { $ne: 'archived' }
        });

        if (!contact) {
          throw new AppError('Contact not found', 404);
        }

        // Store contact data for audit
        const contactData = {
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
          status: contact.status,
          notesCount: contact.notes.length
        };

        // Soft delete by updating status to archived
        const deletedContact = await Contact.findByIdAndUpdate(
          contactId,
          {
            status: 'archived',
            lastModifiedBy: auditContext.performedBy,
            lastModifiedByName: auditContext.performedByName
          },
          { new: true }
        );

        if (!deletedContact) {
          throw new AppError('Failed to delete contact', 500);
        }

        // Create audit log
        await AuditLog.create([{
          organizationId: auditContext.organizationId,
          entityType: 'contact',
          entityId: contactId,
          action: 'delete',
          changes: {
            old: contactData,
            new: { status: 'archived' }
          },
          performedBy: auditContext.performedBy,
          performedByName: auditContext.performedByName,
          metadata: {
            ipAddress: auditContext.ipAddress,
            userAgent: auditContext.userAgent,
            description: auditContext.description || 'Contact deleted'
          },
          timestamp: new Date()
        }]);

        return {
          deletedId: contactId,
          deletedAt: new Date()
        };
    //   });

    //   return result;

    } catch (error) {
      console.error('Contact deletion error:', error);
      throw error;
    } finally {
    //   await session.endSession();
    }
  }

  /**
   * Add note to contact with audit logging using MongoDB transaction
   */
  async addNoteToContact(
    contactId: string,
    noteData: AddNoteRequest,
    auditContext: AuditContext
  ): Promise<IContact> {
    // const session = await mongoose.startSession();

    try {
    //   const result = await session.withTransaction(async () => {
        // Get contact
        const contact = await Contact.findOne({
          _id: contactId,
          organizationId: auditContext.organizationId,
          status: { $ne: 'archived' }
        });

        if (!contact) {
          throw new AppError('Contact not found', 404);
        }

        // Create new note
        const newNote = {
          _id: new mongoose.Types.ObjectId(),
          content: noteData.content.trim(),
          type: noteData.type || 'general',
          addedBy: new mongoose.Types.ObjectId(auditContext.performedBy),
          addedByName: auditContext.performedByName,
          addedAt: new Date(),
          isPrivate: noteData.isPrivate || false
        };

        // Add note to contact
        const updatedContact = await Contact.findByIdAndUpdate(
          contactId,
          {
            $push: { notes: newNote },
            lastModifiedBy: auditContext.performedBy,
            lastModifiedByName: auditContext.performedByName
          },
          { new: true }
        );

        if (!updatedContact) {
          throw new AppError('Failed to add note', 500);
        }

        // Create audit log
        await AuditLog.create([{
          organizationId: auditContext.organizationId,
          entityType: 'note',
          entityId: newNote._id,
          action: 'create',
          changes: {
            new: {
              contactId: contactId,
              content: newNote.content,
              type: newNote.type,
              isPrivate: newNote.isPrivate
            }
          },
          performedBy: auditContext.performedBy,
          performedByName: auditContext.performedByName,
          metadata: {
            ipAddress: auditContext.ipAddress,
            userAgent: auditContext.userAgent,
            description: auditContext.description || 'Note added to contact'
          },
          timestamp: new Date()
        }]);

        return updatedContact;
    //   });

    //   return result;

    } catch (error) {
      console.error('Add note error:', error);
      throw error;
    } finally {
    //   await session.endSession();
    }
  }

  /**
   * List contacts with pagination and filtering
   */
  async listContacts(
    organizationId: string,
    options: {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    } = {}
  ) {
    const {
      page = 1,
      limit = 20,
      search = '',
      status = 'active',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = options;

    // Build query
    const query: any = {
      organizationId: organizationId,
      status: status
    };

    // Add search conditions
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate skip
    const skip = (page - 1) * limit;

    // Execute queries
    const [contacts, total] = await Promise.all([
      Contact.find(query)
        .select('name email phone status createdAt updatedAt')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Contact.countDocuments(query)
    ]);

    // Add virtual noteCount
    const contactsWithCount = contacts.map(contact => ({
      ...contact,
      noteCount: contact.notes?.length || 0
    }));

    return {
      contacts: contactsWithCount,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    };
  }

  /**
   * Get contact audit logs
   */
  async getContactAuditLogs(
    contactId: string,
    organizationId: string,
    options: { page?: number; limit?: number } = {}
  ) {
    const { page = 1, limit = 20 } = options;
    const skip = (page - 1) * limit;

    // Verify contact exists and belongs to organization
    const contact = await Contact.findOne({
      _id: contactId,
      organizationId: organizationId
    });

    if (!contact) {
      throw new AppError('Contact not found', 404);
    }

    const [auditLogs, total] = await Promise.all([
      AuditLog.find({
        organizationId: organizationId,
        $or: [
          { entityId: contactId, entityType: 'contact' },
          { 'changes.new.contactId': contactId, entityType: 'note' }
        ]
      })
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      AuditLog.countDocuments({
        organizationId: organizationId,
        $or: [
          { entityId: contactId, entityType: 'contact' },
          { 'changes.new.contactId': contactId, entityType: 'note' }
        ]
      })
    ]);

    return {
      auditLogs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    };
  }
}

export default new ContactService();