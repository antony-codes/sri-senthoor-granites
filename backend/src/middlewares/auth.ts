import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

export interface AuthRequest extends Request {
  user?: any;
}

// Role default permissions mapping
export const ROLE_PERMISSIONS: Record<string, string[]> = {
  super_admin: [
    'users:manage',
    'products:manage',
    'products:price_update',
    'categories:manage',
    'gallery:manage',
    'testimonials:manage',
    'inquiries:manage',
    'settings:manage',
    'audit:read',
  ],
  admin: [
    'products:manage',
    'products:price_update',
    'categories:manage',
    'gallery:manage',
    'testimonials:manage',
    'inquiries:manage',
    'audit:read',
  ],
  staff: [
    'inquiries:manage',
    'products:read',
  ],
};

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'sri_senthoor_granites_super_secret_jwt_key_2026';
    const decoded: any = jwt.verify(token, secret);

    try {
      const user = await User.findById(decoded.id).select('-passwordHash');
      if (user) {
        if (!user.isActive) {
          return res.status(403).json({ success: false, message: 'Your account has been deactivated. Please contact Super Admin.' });
        }
        req.user = user;
        return next();
      }
    } catch {
      // Fallthrough to fallback user object
    }

    // Fallback user object if DB offline
    req.user = {
      _id: decoded.id || 'admin_id',
      id: decoded.id || 'admin_id',
      name: decoded.name || 'Arshath (Founder)',
      email: decoded.email || 'admin@srisenthoorgranites.com',
      role: decoded.role || 'super_admin',
      permissions: decoded.permissions || ROLE_PERMISSIONS[decoded.role || 'super_admin'] || [],
      isActive: true,
    };

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};

// Middleware enforcing fine-grained RBAC & user permission overrides
export const requirePermission = (permission: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const userRole = req.user.role || 'staff';

    // Super Admin has full unrestricted access
    if (userRole === 'super_admin') {
      return next();
    }

    // Combine role-based defaults + user explicit custom permissions
    const defaultRolePerms = ROLE_PERMISSIONS[userRole] || [];
    const customUserPerms = req.user.permissions || [];
    const effectivePermissions = Array.from(new Set([...defaultRolePerms, ...customUserPerms]));

    if (effectivePermissions.includes(permission) || effectivePermissions.includes('all')) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: `Access denied. Requires '${permission}' permission.`,
    });
  };
};
