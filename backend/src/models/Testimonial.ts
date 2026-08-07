import mongoose, { Schema, Document } from 'mongoose';

export interface ITestimonialDocument extends Document {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  project: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    role: { type: String, required: true },
    content: { type: String, required: true },
    rating: { type: Number, default: 5 },
    project: { type: String, default: '' },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Testimonial = mongoose.model<ITestimonialDocument>('Testimonial', TestimonialSchema);
