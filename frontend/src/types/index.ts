export interface ICategory {
  _id?: string;
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  image?: string;
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
  id?: string;
  name: string;
  email: string;
  role: 'admin' | 'manager';
  createdAt?: string;
}
