import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

export interface AuthRequest extends Request {
  user?: any;
}

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

    // Try finding user in database or fallback
    try {
      const user = await User.findById(decoded.id).select('-passwordHash');
      if (user) {
        req.user = user;
        return next();
      }
    } catch {
      // Fallback user if DB is running in simulated mode
    }

    req.user = { id: decoded.id, email: decoded.email, role: decoded.role || 'admin' };
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};
