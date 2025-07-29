import mongoose, { Document, Schema } from 'mongoose';

export interface INote {
  _id: mongoose.Types.ObjectId;
  content: string;
  type: 'call' | 'meeting' | 'email' | 'general';
  addedBy: mongoose.Types.ObjectId;
  addedByName: string;
  addedAt: Date;
  isPrivate: boolean;
}

export interface IContact extends Document {
  _id: mongoose.Types.ObjectId;
  organizationId: mongoose.Types.ObjectId;
  name: string;
  email?: string;
  phone?: string;
  notes: INote[];
  createdBy: mongoose.Types.ObjectId;
  createdByName: string;
  lastModifiedBy?: mongoose.Types.ObjectId;
  lastModifiedByName?: string;
  status: 'active' | 'inactive' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema = new Schema<INote>({
  content: {
    type: String,
    required: true,
    maxlength: [2000, 'Note cannot exceed 2000 characters']
  },
  type: {
    type: String,
    enum: ['call', 'meeting', 'email', 'general'],
    default: 'general'
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  addedByName: {
    type: String,
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  },
  isPrivate: {
    type: Boolean,
    default: false
  }
}, { _id: true });

const contactSchema = new Schema<IContact>(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true
    },
    name: {
      type: String,
      required: [true, 'Contact name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      validate: {
        validator: function(email: string) {
          return !email || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
        },
        message: 'Please enter a valid email'
      }
    },
    phone: {
      type: String,
      trim: true,
      validate: {
        validator: function(phone: string) {
          return !phone || /^[\+]?[\d\s\-\(\)]{10,}$/.test(phone);
        },
        message: 'Please enter a valid phone number'
      }
    },
    notes: [noteSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdByName: {
      type: String,
      required: true
    },
    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    lastModifiedByName: String,
    status: {
      type: String,
      enum: ['active', 'inactive', 'archived'],
      default: 'active'
    }
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Compound indexes for multi-tenant queries
contactSchema.index({ organizationId: 1, status: 1 });
contactSchema.index({ organizationId: 1, createdAt: -1 });
contactSchema.index({ organizationId: 1, name: 1 });
contactSchema.index({ organizationId: 1, email: 1 }, { sparse: true });

// Unique email within organization
contactSchema.index(
  { organizationId: 1, email: 1 }, 
  { unique: true, sparse: true }
);

// Text search index
contactSchema.index({
  name: 'text',
  email: 'text',
  'notes.content': 'text'
});

// Virtual for note count
contactSchema.virtual('noteCount').get(function() {
  return this.notes ? this.notes.length : 0;
});

const Contact = mongoose.model<IContact>('Contact', contactSchema);

export default Contact;