import { Router } from 'express';
import { login, forgotPassword, resetPassword, getMe } from '../controllers/authController';
import { protect } from '../middlewares/auth';

const router = Router();

router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', protect, getMe);

export default router;
