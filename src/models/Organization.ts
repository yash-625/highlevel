import mongoose, { Document, Schema } from 'mongoose';

export interface IOrganization extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  status: 'active' | 'suspended' | 'inactive';
  settings: {
    maxUsers: number;
    maxContacts: number;
    features: {
      auditLogs: boolean;
      advancedNotes: boolean;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

const organizationSchema = new Schema<IOrganization>(
  {
    name: {
      type: String,
      required: [true, 'Organization name is required'],
      trim: true,
      minlength: [2, 'Organization name must be at least 2 characters'],
      maxlength: [100, 'Organization name cannot exceed 100 characters']
    },
    slug: {
      type: String,
      required: false,
      unique: true,
      lowercase: true,
      trim: true
    },
    status: {
      type: String,
      enum: ['active', 'suspended', 'inactive'],
      default: 'active'
    },
    settings: {
      maxUsers: { type: Number, default: 50 },
      maxContacts: { type: Number, default: 10000 },
      features: {
        auditLogs: { type: Boolean, default: true },
        advancedNotes: { type: Boolean, default: true }
      }
    }
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: (_doc, ret) => {
        delete (ret as any).__v;
        return ret;
      }
    }
  }
);

// Indexes
organizationSchema.index({ slug: 1 });
organizationSchema.index({ status: 1 });

// Generate slug from name before saving
organizationSchema.pre('save', function(next) {
  if (this.isModified('name') || this.isNew) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  next();
});

const Organization = mongoose.model<IOrganization>('Organization', organizationSchema);

export default Organization;