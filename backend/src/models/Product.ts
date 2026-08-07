import mongoose, { Schema, Document } from 'mongoose';

export interface IProductDocument extends Document {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  subCategory?: string;
  description: string;
  shortDescription?: string;
  price?: number;
  offerPrice?: number;
  unit?: string;
  brand?: string;
  material?: string;
  finish?: string;
  thickness?: string;
  dimensions?: string;
  color?: string;
  image: string;
  images: string[];
  features: string[];
  specs: Record<string, string>;
  stockStatus: 'in_stock' | 'out_of_stock' | 'on_order';
  isFeatured: boolean;
  isPopular: boolean;
  displayOrder: number;
  status: 'active' | 'draft' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, default: '' },
    category: { type: String, required: true, index: true },
    subCategory: { type: String, default: '', index: true },
    description: { type: String, default: '' },
    shortDescription: { type: String, default: '' },
    price: { type: Number },
    offerPrice: { type: Number },
    unit: { type: String, default: 'sq.ft' },
    brand: { type: String, default: 'Sri Senthoor Select' },
    material: { type: String },
    finish: { type: String },
    thickness: { type: String },
    dimensions: { type: String },
    color: { type: String },
    image: { type: String, required: true },
    images: [{ type: String }],
    features: [{ type: String }],
    specs: { type: Schema.Types.Mixed, default: {} },
    stockStatus: { type: String, enum: ['in_stock', 'out_of_stock', 'on_order'], default: 'in_stock' },
    isFeatured: { type: Boolean, default: false },
    isPopular: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'draft', 'archived'], default: 'active' },
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProductDocument>('Product', ProductSchema);
