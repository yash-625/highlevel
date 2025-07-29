import mongoose, { Document, Schema } from 'mongoose';

export interface IAuditLog extends Document {
  _id: mongoose.Types.ObjectId;
  organizationId: mongoose.Types.ObjectId;
  entityType: 'contact' | 'note' | 'user';
  entityId: mongoose.Types.ObjectId;
  action: 'create' | 'update' | 'delete' | 'restore';
  changes: {
    old?: any;
    new?: any;
  };
  performedBy: mongoose.Types.ObjectId;
  performedByName: string;
  metadata: {
    ipAddress?: string;
    userAgent?: string;
    description?: string;
  };
  timestamp: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true
    },
    entityType: {
      type: String,
      enum: ['contact', 'note', 'user'],
      required: true
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true
    },
    action: {
      type: String,
      enum: ['create', 'update', 'delete', 'restore'],
      required: true
    },
    changes: {
      old: mongoose.Schema.Types.Mixed,
      new: mongoose.Schema.Types.Mixed
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    performedByName: {
      type: String,
      required: true
    },
    metadata: {
      ipAddress: String,
      userAgent: String,
      description: String
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    versionKey: false
  }
);

// Compound indexes for efficient queries
auditLogSchema.index({ organizationId: 1, timestamp: -1 });
auditLogSchema.index({ organizationId: 1, entityId: 1, timestamp: -1 });
auditLogSchema.index({ organizationId: 1, entityType: 1, timestamp: -1 });
auditLogSchema.index({ organizationId: 1, performedBy: 1, timestamp: -1 });

const AuditLog = mongoose.model<IAuditLog>('AuditLog', auditLogSchema);


export default AuditLog;