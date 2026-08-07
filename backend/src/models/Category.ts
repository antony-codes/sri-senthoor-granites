import mongoose, { Schema, Document } from 'mongoose';

export interface ICategoryDocument extends Document {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  image?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, default: '' },
    description: { type: String, default: '' },
    icon: { type: String, default: 'Layers' },
    image: { type: String, default: '' },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Category = mongoose.model<ICategoryDocument>('Category', CategorySchema);
