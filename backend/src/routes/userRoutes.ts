import { Router } from 'express';
import {
  getUsers,
  createUser,
  updateUser,
  updateUserPermissions,
  toggleUserActive,
  resetUserPassword,
  deleteUser,
  getMyProfile,
  updateMyProfile,
  uploadAvatar,
  removeAvatar,
} from '../controllers/userController';
import { protect, requirePermission } from '../middlewares/auth';

const router = Router();

// 1. Protect all user routes
router.use(protect);

// 2. Self-service profile routes (Available to any logged-in user)
router.get('/profile/me', getMyProfile);
router.put('/profile/me', updateMyProfile);
router.post('/profile/avatar', uploadAvatar);
router.delete('/profile/avatar', removeAvatar);

// 3. User Administration routes (Requires 'users:manage' permission)
router.use(requirePermission('users:manage'));

router.get('/', getUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.put('/:id/permissions', updateUserPermissions);
router.put('/:id/toggle-active', toggleUserActive);
router.post('/:id/reset-password', resetUserPassword);
router.delete('/:id', deleteUser);

export default router;
