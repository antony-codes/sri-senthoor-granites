import React, { useEffect, useState } from 'react';
import {
  History,
  User,
  Clock,
  Package,
  Layers,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { IAuditLog } from '@/types';
import { fetchAuditLogsApi } from '@/services/api';
import { DataTable, DataTableColumn } from '@/components/common/DataTable';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';

export const AuditLogManagement: React.FC = () => {
  const [logs, setLogs] = useState<IAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [entityFilter, setEntityFilter] = useState('all');

  // Pagination State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const loadAuditLogs = async () => {
    setLoading(true);
    try {
      const res = await fetchAuditLogsApi(search, entityFilter, 'all', page, limit);
      setLogs(res.data);
      setTotalCount(res.totalCount);
      setTotalPages(res.totalPages);
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuditLogs();
  }, [search, entityFilter, page, limit]);

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

  // Reusable DataTable Columns
  const columns: DataTableColumn<IAuditLog>[] = [
    {
      header: '#',
      headerClassName: 'w-12 text-center',
      className: 'text-center font-bold text-gray-400',
      cell: (_, idx) => (page - 1) * limit + idx + 1,
    },
    {
      header: 'System Action & Details',
      cell: (log) => {
        const isPriceChange = log.action.toLowerCase().includes('price');
        return (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 shadow-2xs">
              {getEntityIcon(log.entityType)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900 block text-xs">{log.action}</span>
                {isPriceChange && (
                  <Badge variant="default" className="text-[9px] py-0 px-1.5">
                    <TrendingUp className="w-2.5 h-2.5" /> Price Update
                  </Badge>
                )}
              </div>
              <span className="text-gray-500 text-[11px] block">
                Target Entity: <strong className="text-gray-700 font-semibold">{log.entityType}</strong>
              </span>
            </div>
          </div>
        );
      },
    },
    {
      header: 'Performed By',
      cell: (log) => (
        <div>
          <span className="font-semibold text-gray-900 block">{log.userName}</span>
          {log.userEmail && <span className="text-gray-500 text-[11px] block">{log.userEmail}</span>}
        </div>
      ),
    },
    {
      header: 'Timestamp',
      headerClassName: 'text-right',
      className: 'text-right font-semibold text-gray-800',
      cell: (log) => {
        const formattedDate = new Date(log.createdAt).toLocaleString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });
        return (
          <span className="inline-flex items-center gap-1 text-[11px] justify-end">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            {formattedDate}
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      <DataTable
        title="System Audit Logs"
        subtitle="Track business operations, price updates, user additions, and system actions."
        data={logs}
        columns={columns}
        keyExtractor={(log, idx) => log._id || `log-${idx}`}
        loading={loading}
        emptyMessage="No audit log entries recorded matching filter query."
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        searchPlaceholder="Search audit actions, user names..."
        filters={
          <Select
            value={entityFilter}
            onChange={(e) => {
              setEntityFilter(e.target.value);
              setPage(1);
            }}
            className="w-44"
          >
            <option value="all">All Entity Types</option>
            <option value="product">Products & Pricing</option>
            <option value="category">Categories</option>
            <option value="user">User Accounts</option>
            <option value="inquiry">Customer Leads</option>
            <option value="system">System Auth</option>
          </Select>
        }
        actions={
          <div className="px-3 py-1.5 bg-gray-100 rounded-xl border border-gray-200 text-xs font-bold text-gray-800 flex items-center gap-2">
            <History className="w-4 h-4 text-black" />
            <span>Total Events: {totalCount}</span>
          </div>
        }
        currentPage={page}
        totalPages={totalPages}
        totalCount={totalCount}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={(l) => {
          setLimit(l);
          setPage(1);
        }}
      />
    </div>
  );
};
