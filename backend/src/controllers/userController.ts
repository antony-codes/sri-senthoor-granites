import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { AuthRequest } from '../middlewares/auth';
import { logAuditEvent } from '../utils/auditLogger';

// In-memory fallback list if database is not active
export let inMemoryUsers = [
  {
    _id: 'admin_id_001',
    id: 'admin_id_001',
    name: 'Arshath (Founder)',
    email: 'admin@srisenthoorgranites.com',
    role: 'super_admin',
    permissions: [
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
    isActive: true,
    lastLogin: new Date(),
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  },
  {
    _id: 'admin_id_002',
    id: 'admin_id_002',
    name: 'Showroom Admin',
    email: 'showroom@srisenthoorgranites.com',
    role: 'admin',
    permissions: [
      'products:manage',
      'products:price_update',
      'categories:manage',
      'gallery:manage',
      'testimonials:manage',
      'inquiries:manage',
      'audit:read',
    ],
    isActive: true,
    lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
  },
  {
    _id: 'staff_id_001',
    id: 'staff_id_001',
    name: 'Sales Staff',
    email: 'sales@srisenthoorgranites.com',
    role: 'staff',
    permissions: ['inquiries:manage', 'products:read'],
    isActive: true,
    lastLogin: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
];

// GET /api/users
export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const { search, role, status } = req.query;
    let usersList: any[] = [];

    try {
      usersList = await User.find().select('-passwordHash').sort({ createdAt: -1 });
      if (usersList.length === 0) {
        usersList = inMemoryUsers;
      }
    } catch {
      usersList = inMemoryUsers;
    }

    // Apply filtering
    if (search) {
      const q = String(search).toLowerCase();
      usersList = usersList.filter(
        (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      );
    }

    if (role && role !== 'all') {
      usersList = usersList.filter((u) => u.role === role);
    }

    if (status && status !== 'all') {
      const isActiveBool = status === 'active';
      usersList = usersList.filter((u) => u.isActive === isActiveBool);
    }

    return res.status(200).json({ success: true, count: usersList.length, data: usersList });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/users
export const createUser = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, password, role, permissions } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    const assignedRole = role || 'staff';
    const assignedPermissions = Array.isArray(permissions) ? permissions : [];
    const passwordHash = await bcrypt.hash(password, 10);

    let newUser: any;

    try {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'User with this email already exists' });
      }

      newUser = await User.create({
        name,
        email: email.toLowerCase(),
        passwordHash,
        role: assignedRole,
        permissions: assignedPermissions,
        isActive: true,
      });
    } catch {
      // In-memory fallback
      newUser = {
        _id: 'user_' + Date.now(),
        id: 'user_' + Date.now(),
        name,
        email: email.toLowerCase(),
        role: assignedRole,
        permissions: assignedPermissions,
        isActive: true,
        createdAt: new Date(),
      };
      inMemoryUsers.unshift(newUser);
    }

    // Audit Log Entry
    const actorName = req.user?.name || 'Super Admin';
    await logAuditEvent({
      reqUser: req.user,
      action: `${actorName} created user "${name}" with role "${assignedRole.toUpperCase()}"`,
      entityType: 'user',
      entityId: newUser._id?.toString() || newUser.id,
      details: { name, email, role: assignedRole, permissions: assignedPermissions },
    });

    const responseData = { ...newUser.toObject ? newUser.toObject() : newUser };
    delete responseData.passwordHash;

    return res.status(201).json({ success: true, data: responseData });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/users/:id
export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    let updatedUser: any;
    let oldRole = '';

    try {
      const user = await User.findById(id);
      if (!user) {
        // Check in-memory fallback
        const memIdx = inMemoryUsers.findIndex((u) => u._id === id || u.id === id);
        if (memIdx !== -1) {
          oldRole = inMemoryUsers[memIdx].role;
          inMemoryUsers[memIdx] = {
            ...inMemoryUsers[memIdx],
            name: name || inMemoryUsers[memIdx].name,
            email: email || inMemoryUsers[memIdx].email,
            role: role || inMemoryUsers[memIdx].role,
          };
          updatedUser = inMemoryUsers[memIdx];
        } else {
          return res.status(404).json({ success: false, message: 'User not found' });
        }
      } else {
        oldRole = user.role;
        user.name = name || user.name;
        user.email = email ? email.toLowerCase() : user.email;
        user.role = role || user.role;
        await user.save();
        updatedUser = user;
      }
    } catch {
      const memIdx = inMemoryUsers.findIndex((u) => u._id === id || u.id === id);
      if (memIdx !== -1) {
        oldRole = inMemoryUsers[memIdx].role;
        inMemoryUsers[memIdx] = {
          ...inMemoryUsers[memIdx],
          name: name || inMemoryUsers[memIdx].name,
          email: email || inMemoryUsers[memIdx].email,
          role: role || inMemoryUsers[memIdx].role,
        };
        updatedUser = inMemoryUsers[memIdx];
      }
    }

    const actorName = req.user?.name || 'Super Admin';
    let actionMsg = `${actorName} updated details for user "${updatedUser?.name || name}"`;
    if (role && oldRole && oldRole !== role) {
      actionMsg = `${actorName} changed user "${updatedUser?.name || name}" role from ${oldRole.toUpperCase()} to ${role.toUpperCase()}`;
    }

    await logAuditEvent({
      reqUser: req.user,
      action: actionMsg,
      entityType: 'user',
      entityId: id,
      details: { name, email, role, previousRole: oldRole },
    });

    return res.status(200).json({ success: true, data: updatedUser });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/users/:id/permissions
export const updateUserPermissions = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { permissions } = req.body;

    if (!Array.isArray(permissions)) {
      return res.status(400).json({ success: false, message: 'Permissions array is required' });
    }

    let updatedUser: any;

    try {
      const user = await User.findById(id);
      if (user) {
        user.permissions = permissions;
        await user.save();
        updatedUser = user;
      } else {
        const memIdx = inMemoryUsers.findIndex((u) => u._id === id || u.id === id);
        if (memIdx !== -1) {
          inMemoryUsers[memIdx].permissions = permissions;
          updatedUser = inMemoryUsers[memIdx];
        }
      }
    } catch {
      const memIdx = inMemoryUsers.findIndex((u) => u._id === id || u.id === id);
      if (memIdx !== -1) {
        inMemoryUsers[memIdx].permissions = permissions;
        updatedUser = inMemoryUsers[memIdx];
      }
    }

    const actorName = req.user?.name || 'Super Admin';
    await logAuditEvent({
      reqUser: req.user,
      action: `${actorName} updated permissions for user "${updatedUser?.name || id}" (${permissions.length} permissions active)`,
      entityType: 'user',
      entityId: id,
      details: { permissions },
    });

    return res.status(200).json({ success: true, data: updatedUser });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/users/:id/toggle-active
export const toggleUserActive = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    let updatedUser: any;

    try {
      const user = await User.findById(id);
      if (user) {
        user.isActive = typeof isActive === 'boolean' ? isActive : !user.isActive;
        await user.save();
        updatedUser = user;
      } else {
        const memIdx = inMemoryUsers.findIndex((u) => u._id === id || u.id === id);
        if (memIdx !== -1) {
          inMemoryUsers[memIdx].isActive = typeof isActive === 'boolean' ? isActive : !inMemoryUsers[memIdx].isActive;
          updatedUser = inMemoryUsers[memIdx];
        }
      }
    } catch {
      const memIdx = inMemoryUsers.findIndex((u) => u._id === id || u.id === id);
      if (memIdx !== -1) {
        inMemoryUsers[memIdx].isActive = typeof isActive === 'boolean' ? isActive : !inMemoryUsers[memIdx].isActive;
        updatedUser = inMemoryUsers[memIdx];
      }
    }

    const actorName = req.user?.name || 'Super Admin';
    const statusStr = updatedUser?.isActive ? 'ACTIVATED' : 'DEACTIVATED';
    await logAuditEvent({
      reqUser: req.user,
      action: `${actorName} ${statusStr} user "${updatedUser?.name || id}"`,
      entityType: 'user',
      entityId: id,
      details: { isActive: updatedUser?.isActive },
    });

    return res.status(200).json({ success: true, data: updatedUser });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/users/:id/reset-password
export const resetUserPassword = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 4) {
      return res.status(400).json({ success: false, message: 'Password must be at least 4 characters long' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    let targetUserName = '';

    try {
      const user = await User.findById(id);
      if (user) {
        user.passwordHash = passwordHash;
        await user.save();
        targetUserName = user.name;
      } else {
        const memUser = inMemoryUsers.find((u) => u._id === id || u.id === id);
        if (memUser) targetUserName = memUser.name;
      }
    } catch {
      const memUser = inMemoryUsers.find((u) => u._id === id || u.id === id);
      if (memUser) targetUserName = memUser.name;
    }

    const actorName = req.user?.name || 'Super Admin';
    await logAuditEvent({
      reqUser: req.user,
      action: `${actorName} reset password for user "${targetUserName || id}"`,
      entityType: 'user',
      entityId: id,
    });

    return res.status(200).json({ success: true, message: 'Password reset successfully' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/users/:id
export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    let targetUserName = '';

    try {
      const user = await User.findById(id);
      if (user) {
        targetUserName = user.name;
        await user.deleteOne();
      } else {
        const memIdx = inMemoryUsers.findIndex((u) => u._id === id || u.id === id);
        if (memIdx !== -1) {
          targetUserName = inMemoryUsers[memIdx].name;
          inMemoryUsers.splice(memIdx, 1);
        }
      }
    } catch {
      const memIdx = inMemoryUsers.findIndex((u) => u._id === id || u.id === id);
      if (memIdx !== -1) {
        targetUserName = inMemoryUsers[memIdx].name;
        inMemoryUsers.splice(memIdx, 1);
      }
    }

    const actorName = req.user?.name || 'Super Admin';
    await logAuditEvent({
      reqUser: req.user,
      action: `${actorName} deleted user account "${targetUserName || id}"`,
      entityType: 'user',
      entityId: id,
    });

    return res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
