import { Router } from 'express';
import { createInquiry, getInquiries, updateInquiryStatus } from '../controllers/inquiryController';
import { protect } from '../middlewares/auth';

const router = Router();

router.post('/', createInquiry);
router.get('/', protect, getInquiries);
router.patch('/:id/status', protect, updateInquiryStatus);

export default router;
