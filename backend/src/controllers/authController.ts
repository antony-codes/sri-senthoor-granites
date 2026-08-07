import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const generateToken = (id: string, email: string, role: string) => {
  const secret = process.env.JWT_SECRET || 'sri_senthoor_granites_super_secret_jwt_key_2026';
  return jwt.sign({ id, email, role }, secret, { expiresIn: '7d' });
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Check default admin fallback
    const defaultEmail = 'admin@srisenthoorgranites.com';
    const defaultPass = 'Admin@123456';

    let user: any = null;
    try {
      user = await User.findOne({ email: email.toLowerCase() });
    } catch {
      // In case MongoDB is offline
    }

    if (user) {
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
      const token = generateToken(user._id, user.email, user.role);
      return res.json({
        success: true,
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      });
    }

    // Default admin fallback validation
    if (email.toLowerCase() === defaultEmail && password === defaultPass) {
      const token = generateToken('admin-static-1', defaultEmail, 'admin');
      return res.json({
        success: true,
        token,
        user: { id: 'admin-static-1', name: 'Arshath (Founder)', email: defaultEmail, role: 'admin' },
      });
    }

    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMe = async (req: any, res: Response) => {
  res.json({ success: true, user: req.user });
};
