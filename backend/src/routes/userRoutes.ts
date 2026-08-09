import { Router } from 'express';
import {
  getUsers,
  createUser,
  updateUser,
  updateUserPermissions,
  toggleUserActive,
  resetUserPassword,
  deleteUser,
} from '../controllers/userController';
import { protect, requirePermission } from '../middlewares/auth';

const router = Router();

// Protect all user endpoints and require 'users:manage' permission
router.use(protect);
router.use(requirePermission('users:manage'));

router.get('/', getUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.put('/:id/permissions', updateUserPermissions);
router.put('/:id/toggle-active', toggleUserActive);
router.post('/:id/reset-password', resetUserPassword);
router.delete('/:id', deleteUser);

export default router;
