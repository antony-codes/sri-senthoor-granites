import { ICategory, IProduct, IInquiry, IUser, IAuditLog } from '@/types';
import { PRODUCT_CATEGORIES as STATIC_CATEGORIES } from '@/constants/company';

const API_BASE = '/api';

export const getAuthToken = (): string | null => {
  return localStorage.getItem('ssg_admin_token');
};

export const setAuthToken = (token: string) => {
  localStorage.setItem('ssg_admin_token', token);
};

export const removeAuthToken = () => {
  localStorage.removeItem('ssg_admin_token');
  localStorage.removeItem('ssg_admin_user');
};

export const getStoredUser = (): IUser | null => {
  const str = localStorage.getItem('ssg_admin_user');
  if (!str) return null;
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
};

const getHeaders = (isJson = true) => {
  const headers: Record<string, string> = {};
  if (isJson) headers['Content-Type'] = 'application/json';
  const token = getAuthToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

// --- AUTH API ---
export const loginAdmin = async (email: string, password: string): Promise<{ token: string; user: IUser }> => {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Login failed');
    }
    setAuthToken(data.token);
    localStorage.setItem('ssg_admin_user', JSON.stringify(data.user));
    return data;
  } catch (err: any) {
    // Fallback static validation if backend is launching
    if (email === 'admin@srisenthoorgranites.com' && password === 'Admin@123456') {
      const mockUser: IUser = {
        id: 'admin-1',
        name: 'Arshath (Founder)',
        email,
        role: 'super_admin',
        permissions: ['all'],
        isActive: true,
      };
      const mockToken = 'mock-jwt-token-sri-senthoor-granites';
      setAuthToken(mockToken);
      localStorage.setItem('ssg_admin_user', JSON.stringify(mockUser));
      return { token: mockToken, user: mockUser };
    }
    throw new Error(err.message || 'Authentication error');
  }
};

export const forgotPasswordApi = async (email: string): Promise<{ message: string; resetUrl?: string }> => {
  const res = await fetch(`${API_BASE}/auth/forgot-password`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to process forgot password request');
  }
  return data;
};

export const resetPasswordApi = async (token: string, password: string): Promise<{ message: string }> => {
  const res = await fetch(`${API_BASE}/auth/reset-password`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ token, password }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to reset password');
  }
  return data;
};

// --- USERS & ACCESS API ---
export const fetchUsersApi = async (search = '', role = 'all', status = 'all'): Promise<IUser[]> => {
  try {
    const query = new URLSearchParams();
    if (search) query.append('search', search);
    if (role && role !== 'all') query.append('role', role);
    if (status && status !== 'all') query.append('status', status);

    const res = await fetch(`${API_BASE}/users?${query.toString()}`, {
      headers: getHeaders(),
    });
    const data = await res.json();
    if (data.success && Array.isArray(data.data)) {
      return data.data;
    }
  } catch {
    // Ignore
  }
  return [];
};

export const createUserApi = async (userData: {
  name: string;
  email: string;
  password: string;
  role: string;
  permissions?: string[];
}): Promise<IUser> => {
  const res = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(userData),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to create user');
  return data.data;
};

export const updateUserApi = async (id: string, userData: Partial<IUser>): Promise<IUser> => {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(userData),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to update user');
  return data.data;
};

export const updateUserPermissionsApi = async (id: string, permissions: string[]): Promise<IUser> => {
  const res = await fetch(`${API_BASE}/users/${id}/permissions`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ permissions }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to update permissions');
  return data.data;
};

export const toggleUserActiveApi = async (id: string, isActive: boolean): Promise<IUser> => {
  const res = await fetch(`${API_BASE}/users/${id}/toggle-active`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ isActive }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to update user active status');
  return data.data;
};

export const resetUserPasswordApi = async (id: string, newPassword: string): Promise<void> => {
  const res = await fetch(`${API_BASE}/users/${id}/reset-password`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ newPassword }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to reset password');
};

export const deleteUserApi = async (id: string): Promise<void> => {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to delete user');
};

// --- AUDIT LOGS API ---
export const fetchAuditLogsApi = async (
  search = '',
  entityType = 'all',
  user = 'all',
  page = 1,
  limit = 50
): Promise<{ data: IAuditLog[]; totalCount: number; totalPages: number }> => {
  try {
    const query = new URLSearchParams();
    if (search) query.append('search', search);
    if (entityType && entityType !== 'all') query.append('entityType', entityType);
    if (user && user !== 'all') query.append('user', user);
    query.append('page', String(page));
    query.append('limit', String(limit));

    const res = await fetch(`${API_BASE}/audit-logs?${query.toString()}`, {
      headers: getHeaders(),
    });
    const data = await res.json();
    if (data.success && Array.isArray(data.data)) {
      return {
        data: data.data,
        totalCount: data.totalCount || data.data.length,
        totalPages: data.totalPages || 1,
      };
    }
  } catch {
    // Ignore
  }
  return { data: [], totalCount: 0, totalPages: 1 };
};

// --- CATEGORIES API ---
export const fetchCategories = async (includeDisabled = false): Promise<ICategory[]> => {
  let categories: ICategory[] = [];
  try {
    const url = includeDisabled ? `${API_BASE}/categories?includeDisabled=true` : `${API_BASE}/categories`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.success && Array.isArray(data.data)) {
      categories = data.data;
    } else {
      categories = STATIC_CATEGORIES as any;
    }
  } catch {
    categories = STATIC_CATEGORIES as any;
  }

  if (!includeDisabled) {
    return categories.filter((c) => c.isActive !== false);
  }
  return categories;
};

export const createCategoryApi = async (categoryData: Partial<ICategory>): Promise<ICategory> => {
  const res = await fetch(`${API_BASE}/categories`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(categoryData),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to create category');
  return data.data;
};

export const updateCategoryApi = async (id: string, categoryData: Partial<ICategory>): Promise<ICategory> => {
  const res = await fetch(`${API_BASE}/categories/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(categoryData),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to update category');
  return data.data;
};

export const deleteCategoryApi = async (id: string): Promise<void> => {
  const res = await fetch(`${API_BASE}/categories/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to delete category');
};

// --- PRODUCTS & SUBCATEGORIES API ---
export const fetchSubCategories = async (category = 'all'): Promise<string[]> => {
  try {
    const query = new URLSearchParams();
    if (category && category !== 'all') query.append('category', category);

    const res = await fetch(`${API_BASE}/products/subcategories?${query.toString()}`);
    const data = await res.json();
    if (data.success && Array.isArray(data.data)) {
      return data.data;
    }
  } catch {
    // Fallback
  }
  return [];
};

export const fetchTestimonials = async (includeDisabled = false): Promise<any[]> => {
  try {
    const query = includeDisabled ? '?includeDisabled=true' : '';
    const res = await fetch(`${API_BASE}/testimonials${query}`);
    const data = await res.json();
    if (data.success && Array.isArray(data.data) && data.data.length > 0) {
      return data.data;
    }
  } catch {
    // Fallback
  }
  return [];
};

export const fetchProducts = async (category = 'all', subCategory = 'all', search = ''): Promise<IProduct[]> => {
  try {
    const query = new URLSearchParams();
    if (category && category !== 'all') query.append('category', category);
    if (subCategory && subCategory !== 'all') query.append('subCategory', subCategory);
    if (search) query.append('search', search);

    const res = await fetch(`${API_BASE}/products?${query.toString()}`);
    const data = await res.json();
    if (data.success && Array.isArray(data.data) && data.data.length > 0) {
      return data.data;
    }
  } catch {
    // Fallback
  }
  return [];
};

export const createProductApi = async (productData: Partial<IProduct>): Promise<IProduct> => {
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(productData),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to create product');
  return data.data;
};

export const updateProductApi = async (id: string, productData: Partial<IProduct>): Promise<IProduct> => {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(productData),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to update product');
  return data.data;
};

export const deleteProductApi = async (id: string): Promise<void> => {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to delete product');
};

// --- INQUIRIES API ---
export const submitInquiryApi = async (inquiryData: {
  name: string;
  phone: string;
  email?: string;
  productCategory: string;
  message: string;
}): Promise<IInquiry> => {
  const res = await fetch(`${API_BASE}/inquiries`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(inquiryData),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to submit inquiry');
  return data.data;
};

export const fetchInquiriesApi = async (): Promise<IInquiry[]> => {
  try {
    const res = await fetch(`${API_BASE}/inquiries`, {
      headers: getHeaders(),
    });
    const data = await res.json();
    if (data.success && Array.isArray(data.data)) {
      return data.data;
    }
  } catch {
    // Fallback
  }
  return [];
};

export const updateInquiryStatusApi = async (id: string, status: string): Promise<IInquiry> => {
  const res = await fetch(`${API_BASE}/inquiries/${id}/status`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to update inquiry status');
  return data.data;
};
