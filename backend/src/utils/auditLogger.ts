import { AuditLog } from '../models/AuditLog';

interface LogAuditParams {
  reqUser?: {
    _id?: string;
    id?: string;
    name?: string;
    email?: string;
    role?: string;
  };
  action: string;
  entityType: 'product' | 'category' | 'gallery' | 'testimonial' | 'inquiry' | 'user' | 'system';
  entityId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
}

// In-memory fallback array for audit logs if DB is offline or running simulated
export const inMemoryAuditLogs: any[] = [];

export const logAuditEvent = async ({
  reqUser,
  action,
  entityType,
  entityId,
  details,
  ipAddress,
}: LogAuditParams) => {
  const userName = reqUser?.name || 'System / Admin';
  const userEmail = reqUser?.email || 'admin@srisenthoorgranites.com';
  const userId = reqUser?._id?.toString() || reqUser?.id || 'admin_id';
  const userRole = reqUser?.role || 'super_admin';

  const entry = {
    userName,
    userEmail,
    userId,
    userRole,
    action,
    entityType,
    entityId: entityId || '',
    details: details || {},
    ipAddress: ipAddress || '',
    createdAt: new Date(),
  };

  try {
    const doc = await AuditLog.create(entry);
    inMemoryAuditLogs.unshift(doc);
    return doc;
  } catch (error) {
    // If DB fails, log to memory
    const fallbackDoc = { ...entry, _id: 'audit_' + Date.now() + Math.random().toString(36).substring(2, 6) };
    inMemoryAuditLogs.unshift(fallbackDoc);
    return fallbackDoc;
  }
};
