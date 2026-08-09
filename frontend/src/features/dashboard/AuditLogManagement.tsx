import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  History,
  Search,
  User,
  Clock,
  Package,
  Layers,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  FileText,
  TrendingUp,
} from 'lucide-react';
import { IAuditLog } from '@/types';
import { fetchAuditLogsApi } from '@/services/api';

export const AuditLogManagement: React.FC = () => {
  const [logs, setLogs] = useState<IAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [entityFilter, setEntityFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  const [totalCount, setTotalCount] = useState(0);

  const loadAuditLogs = async () => {
    setLoading(true);
    try {
      const res = await fetchAuditLogsApi(search, entityFilter, userFilter, 1, 100);
      setLogs(res.data);
      setTotalCount(res.totalCount);
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuditLogs();
  }, [search, entityFilter, userFilter]);

  const getEntityIcon = (entityType: string) => {
    switch (entityType) {
      case 'product':
        return <Package className="w-4 h-4 text-black" />;
      case 'category':
        return <Layers className="w-4 h-4 text-black" />;
      case 'user':
        return <User className="w-4 h-4 text-black" />;
      case 'inquiry':
        return <MessageSquare className="w-4 h-4 text-black" />;
      case 'system':
      default:
        return <ShieldCheck className="w-4 h-4 text-black" />;
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Title & Description */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900 tracking-tight">System Audit Logs</h1>
          <p className="text-xs text-gray-500 mt-1">Track business operations, price updates, user additions, and system actions.</p>
        </div>

        <div className="px-4 py-2 bg-gray-100 rounded-2xl border border-gray-200 text-xs font-bold text-gray-800 flex items-center gap-2">
          <History className="w-4 h-4 text-black" />
          <span>Total Recorded Events: {totalCount}</span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search audit actions, user names, or prices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-black text-gray-900"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto">
          {/* Entity Type Filter */}
          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className="px-3.5 py-2 bg-gray-50 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-black text-gray-900 font-semibold"
          >
            <option value="all">All Entity Types</option>
            <option value="product">Products & Pricing</option>
            <option value="category">Categories</option>
            <option value="user">User Accounts</option>
            <option value="inquiry">Customer Leads</option>
            <option value="system">System Auth</option>
          </select>
        </div>
      </div>

      {/* Audit Feed List */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
        {loading ? (
          <div className="py-12 text-center text-xs text-gray-500">Loading audit history...</div>
        ) : logs.length === 0 ? (
          <div className="py-12 text-center text-xs text-gray-500">No audit log entries recorded yet.</div>
        ) : (
          <div className="space-y-4">
            {logs.map((log, idx) => {
              const logId = log._id || `log-${idx}`;
              const formattedDate = new Date(log.createdAt).toLocaleString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              });

              // Check if action involves price change
              const isPriceChange = log.action.toLowerCase().includes('price');

              return (
                <motion.div
                  key={logId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(idx * 0.03, 0.3) }}
                  className="p-5 rounded-2xl border border-gray-200 hover:border-black bg-gray-50/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-sm group-hover:border-black transition-colors">
                      {getEntityIcon(log.entityType)}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-serif text-sm font-bold text-gray-900 leading-snug">
                          {log.action}
                        </span>

                        {isPriceChange && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                            <TrendingUp className="w-2.5 h-2.5" /> Price Update
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-500 font-sans">
                        <span className="font-semibold text-gray-700">
                          Updated by: <strong className="text-gray-900 font-bold">{log.userName}</strong>
                        </span>

                        {log.userEmail && (
                          <span className="font-mono text-gray-400">({log.userEmail})</span>
                        )}

                        <span className="uppercase text-[9px] font-bold tracking-wider px-2 py-0.5 rounded bg-gray-200 text-gray-700">
                          {log.entityType}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-start sm:items-end text-xs text-gray-500 shrink-0 font-mono">
                    <span className="flex items-center gap-1.5 text-gray-900 font-semibold">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      {formattedDate}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
