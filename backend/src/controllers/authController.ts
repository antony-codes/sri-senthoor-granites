import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../models/User';
import { inMemoryUsers } from './userController';
import { logAuditEvent } from '../utils/auditLogger';
import { ROLE_PERMISSIONS } from '../middlewares/auth';

const generateToken = (id: string, email: string, role: string, permissions: string[]) => {
  const secret = process.env.JWT_SECRET || 'sri_senthoor_granites_super_secret_jwt_key_2026';
  return jwt.sign({ id, email, role, permissions }, secret, { expiresIn: '7d' });
};

// Simple in-memory reset token map fallback
const inMemoryResetTokens = new Map<string, { userId: string; expire: number }>();

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const lowerEmail = email.toLowerCase().trim();
    let userDoc: any = null;

    try {
      userDoc = await User.findOne({ email: lowerEmail });
    } catch {
      // In case MongoDB is offline
    }

    if (userDoc) {
      if (!userDoc.isActive) {
        return res.status(403).json({ success: false, message: 'Your account has been deactivated. Please contact Super Admin.' });
      }

      const isMatch = await bcrypt.compare(password, userDoc.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      // Update lastLogin
      userDoc.lastLogin = new Date();
      await userDoc.save();

      const userRole = userDoc.role || 'staff';
      const userPermissions = Array.from(new Set([...(ROLE_PERMISSIONS[userRole] || []), ...(userDoc.permissions || [])]));

      const token = generateToken(userDoc._id.toString(), userDoc.email, userRole, userPermissions);

      // Audit Log
      await logAuditEvent({
        reqUser: userDoc,
        action: `${userDoc.name} logged into Management Portal`,
        entityType: 'system',
        entityId: userDoc._id.toString(),
      });

      return res.json({
        success: true,
        token,
        user: {
          id: userDoc._id,
          name: userDoc.name,
          email: userDoc.email,
          role: userRole,
          permissions: userPermissions,
          isActive: userDoc.isActive,
          lastLogin: userDoc.lastLogin,
        },
      });
    }

    // Check inMemoryUsers fallback
    const memUser = inMemoryUsers.find((u) => u.email.toLowerCase() === lowerEmail);
    if (memUser) {
      if (!memUser.isActive) {
        return res.status(403).json({ success: false, message: 'Your account has been deactivated. Please contact Super Admin.' });
      }

      // Check if memory user has a custom password hash set
      if ((memUser as any).passwordHash) {
        const isMatch = await bcrypt.compare(password, (memUser as any).passwordHash);
        if (!isMatch) {
          return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
      }

      memUser.lastLogin = new Date();
      const userRole = memUser.role || 'staff';
      const userPermissions = Array.from(new Set([...(ROLE_PERMISSIONS[userRole] || []), ...(memUser.permissions || [])]));

      const token = generateToken(memUser._id || memUser.id, memUser.email, userRole, userPermissions);

      await logAuditEvent({
        reqUser: memUser,
        action: `${memUser.name} logged into Management Portal`,
        entityType: 'system',
        entityId: memUser._id || memUser.id,
      });

      return res.json({
        success: true,
        token,
        user: {
          id: memUser._id || memUser.id,
          name: memUser.name,
          email: memUser.email,
          role: userRole,
          permissions: userPermissions,
          isActive: memUser.isActive,
          lastLogin: memUser.lastLogin,
        },
      });
    }

    // Default Super Admin fallback validation (for initial setup)
    const defaultEmail = 'admin@srisenthoorgranites.com';
    const defaultPass = 'Admin@123456';
    if (lowerEmail === defaultEmail && password === defaultPass) {
      const superAdminUser = {
        _id: 'admin-static-1',
        id: 'admin-static-1',
        name: 'Arshath (Founder)',
        email: defaultEmail,
        role: 'super_admin',
        permissions: ROLE_PERMISSIONS['super_admin'],
        isActive: true,
        lastLogin: new Date(),
      };

      const token = generateToken(superAdminUser.id, defaultEmail, 'super_admin', superAdminUser.permissions);

      await logAuditEvent({
        reqUser: superAdminUser,
        action: `Arshath (Founder) logged into Management Portal as Super Admin`,
        entityType: 'system',
        entityId: superAdminUser.id,
      });

      return res.json({
        success: true,
        token,
        user: superAdminUser,
      });
    }

    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/auth/forgot-password
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
    }

    const lowerEmail = email.toLowerCase().trim();
    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expireTime = Date.now() + 30 * 60 * 1000; // 30 minutes

    let userFound = false;

    try {
      const user = await User.findOne({ email: lowerEmail });
      if (user) {
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpire = new Date(expireTime);
        await user.save();
        userFound = true;
      }
    } catch {
      // Memory fallback
    }

    if (!userFound) {
      const memUser = inMemoryUsers.find((u) => u.email.toLowerCase() === lowerEmail);
      if (memUser) {
        inMemoryResetTokens.set(hashedToken, { userId: memUser._id || memUser.id, expire: expireTime });
        userFound = true;
      } else if (lowerEmail === 'admin@srisenthoorgranites.com') {
        inMemoryResetTokens.set(hashedToken, { userId: 'admin-static-1', expire: expireTime });
        userFound = true;
      }
    }

    if (!userFound) {
      return res.status(404).json({
        success: false,
        message: 'No registered user account found with this email address. Please check and try again.',
      });
    }

    const resetUrl = `/dashboard/reset-password?token=${rawToken}`;

    await logAuditEvent({
      action: `Password reset link requested for registered email: ${lowerEmail}`,
      entityType: 'system',
    });

    return res.status(200).json({
      success: true,
      message: `Password reset link generated for registered email: ${lowerEmail}.`,
      resetUrl,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/auth/reset-password
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ success: false, message: 'Token and new password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const newPasswordHash = await bcrypt.hash(password, 10);

    let resetSuccess = false;
    let resetUserName = '';

    try {
      const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: new Date() },
      });

      if (user) {
        user.passwordHash = newPasswordHash;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        resetUserName = user.name;
        resetSuccess = true;
      }
    } catch {
      // Memory fallback
    }

    if (!resetSuccess) {
      const tokenRecord = inMemoryResetTokens.get(hashedToken);
      if (tokenRecord && tokenRecord.expire > Date.now()) {
        const memIdx = inMemoryUsers.findIndex((u) => (u._id || u.id) === tokenRecord.userId);
        if (memIdx !== -1) {
          inMemoryUsers[memIdx] = {
            ...inMemoryUsers[memIdx],
            passwordHash: newPasswordHash,
          } as any;
          resetUserName = inMemoryUsers[memIdx].name;
        } else {
          resetUserName = 'Arshath (Founder)';
        }
        inMemoryResetTokens.delete(hashedToken);
        resetSuccess = true;
      }
    }

    if (!resetSuccess) {
      return res.status(400).json({ success: false, message: 'Invalid or expired password reset token' });
    }

    await logAuditEvent({
      action: `User "${resetUserName}" successfully reset password via reset link`,
      entityType: 'system',
    });

    return res.json({
      success: true,
      message: 'Your password has been reset successfully. You may now log in with your new password.',
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMe = async (req: any, res: Response) => {
  res.json({ success: true, user: req.user });
};
