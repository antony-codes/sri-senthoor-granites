import mongoose, { Schema, Document } from 'mongoose';

export interface IGalleryDocument extends Document {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  image: string;
  aspect: 'tall' | 'wide' | 'square';
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GallerySchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    image: { type: String, required: true },
    aspect: { type: String, enum: ['tall', 'wide', 'square'], default: 'tall' },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Gallery = mongoose.model<IGalleryDocument>('Gallery', GallerySchema);
