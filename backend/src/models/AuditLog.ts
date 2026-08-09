import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLogDocument extends Document {
  userName: string;
  userEmail: string;
  userId?: string;
  userRole?: string;
  action: string;
  entityType: 'product' | 'category' | 'gallery' | 'testimonial' | 'inquiry' | 'user' | 'system';
  entityId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  createdAt: Date;
}

const AuditLogSchema: Schema = new Schema(
  {
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    userId: { type: String },
    userRole: { type: String },
    action: { type: String, required: true },
    entityType: {
      type: String,
      enum: ['product', 'category', 'gallery', 'testimonial', 'inquiry', 'user', 'system'],
      required: true,
    },
    entityId: { type: String },
    details: { type: Schema.Types.Mixed },
    ipAddress: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const AuditLog = mongoose.model<IAuditLogDocument>('AuditLog', AuditLogSchema);
