export interface ICategory {
  _id?: string;
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IProductSpecs {
  thickness?: string;
  origin?: string;
  finish?: string;
  sizes?: string;
  waterAbsorption?: string;
  material?: string;
  warranty?: string;
  certification?: string;
  finishes?: string;
  pressure?: string;
  [key: string]: string | undefined;
}

export interface IProduct {
  _id?: string;
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string; // Category id (e.g., 'granites', 'vitrified-tiles')
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
  images?: string[];
  features: string[];
  specs: IProductSpecs;
  stockStatus: 'in_stock' | 'out_of_stock' | 'on_order';
  isFeatured: boolean;
  isPopular: boolean;
  displayOrder: number;
  status: 'active' | 'draft' | 'archived';
  createdAt?: string;
  updatedAt?: string;
}

export interface IGalleryItem {
  _id?: string;
  id: string;
  category: string;
  title: string;
  subtitle: string;
  image: string;
  aspect: 'tall' | 'wide' | 'square';
  displayOrder: number;
  isActive: boolean;
}

export interface ITestimonial {
  _id?: string;
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  project: string;
  displayOrder: number;
  isActive: boolean;
}

export interface IInquiry {
  _id?: string;
  id?: string;
  name: string;
  phone: string;
  email?: string;
  productCategory: string;
  message: string;
  status: 'new' | 'contacted' | 'resolved';
  createdAt?: string;
  updatedAt?: string;
}

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  role: 'admin' | 'manager';
  createdAt?: string;
}

export interface IAuthResponse {
  token: string;
  user: IUser;
}
