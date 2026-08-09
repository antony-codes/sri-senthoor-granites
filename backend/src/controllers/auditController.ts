import { Response } from 'express';
import { AuditLog } from '../models/AuditLog';
import { AuthRequest } from '../middlewares/auth';
import { inMemoryAuditLogs } from '../utils/auditLogger';

// GET /api/audit-logs
export const getAuditLogs = async (req: AuthRequest, res: Response) => {
  try {
    const { entityType, search, user, page = '1', limit = '50' } = req.query;

    let logsList: any[] = [];

    try {
      logsList = await AuditLog.find().sort({ createdAt: -1 });
      if (logsList.length === 0) {
        logsList = inMemoryAuditLogs;
      }
    } catch {
      logsList = inMemoryAuditLogs;
    }

    // Apply filtering
    if (entityType && entityType !== 'all') {
      logsList = logsList.filter((log) => log.entityType === entityType);
    }

    if (user && user !== 'all') {
      const uStr = String(user).toLowerCase();
      logsList = logsList.filter(
        (log) => log.userName?.toLowerCase().includes(uStr) || log.userEmail?.toLowerCase().includes(uStr)
      );
    }

    if (search) {
      const q = String(search).toLowerCase();
      logsList = logsList.filter(
        (log) =>
          log.action?.toLowerCase().includes(q) ||
          log.userName?.toLowerCase().includes(q) ||
          log.userEmail?.toLowerCase().includes(q)
      );
    }

    // Pagination
    const pageNum = parseInt(String(page), 10) || 1;
    const limitNum = parseInt(String(limit), 10) || 50;
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedData = logsList.slice(startIndex, startIndex + limitNum);

    return res.status(200).json({
      success: true,
      totalCount: logsList.length,
      page: pageNum,
      totalPages: Math.ceil(logsList.length / limitNum) || 1,
      data: paginatedData,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
