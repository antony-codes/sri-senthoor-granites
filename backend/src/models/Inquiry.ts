import mongoose, { Schema, Document } from 'mongoose';

export interface IInquiryDocument extends Document {
  name: string;
  phone: string;
  email?: string;
  productCategory: string;
  message: string;
  status: 'new' | 'contacted' | 'resolved';
  createdAt: Date;
  updatedAt: Date;
}

const InquirySchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    productCategory: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['new', 'contacted', 'resolved'], default: 'new' },
  },
  { timestamps: true }
);

export const Inquiry = mongoose.model<IInquiryDocument>('Inquiry', InquirySchema);
