import { Router } from 'express';
import { getAuditLogs } from '../controllers/auditController';
import { protect, requirePermission } from '../middlewares/auth';

const router = Router();

router.use(protect);
router.use(requirePermission('audit:read'));

router.get('/', getAuditLogs);

export default router;
