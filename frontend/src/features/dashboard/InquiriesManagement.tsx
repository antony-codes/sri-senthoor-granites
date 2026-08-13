import React, { useState, useEffect } from 'react';
import { Phone, RefreshCw } from 'lucide-react';
import { IInquiry } from '@/types';
import { fetchInquiriesPaginated, updateInquiryStatusApi } from '@/services/api';
import { DataTable, DataTableColumn } from '@/components/common/DataTable';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface InquiriesManagementProps {
  onStatusUpdated?: () => void;
}

export const InquiriesManagement: React.FC<InquiriesManagementProps> = ({ onStatusUpdated }) => {
  const [inquiries, setInquiries] = useState<IInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Pagination State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const loadInquiries = async () => {
    setLoading(true);
    try {
      const res = await fetchInquiriesPaginated(search, statusFilter, page, limit);
      setInquiries(res.data);
      setTotalCount(res.totalCount);
      setTotalPages(res.totalPages);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, [search, statusFilter, page, limit]);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateInquiryStatusApi(id, status);
      await loadInquiries();
      if (onStatusUpdated) onStatusUpdated();
      window.dispatchEvent(new CustomEvent('leadStatusChanged'));
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  // Reusable DataTable Columns
  const columns: DataTableColumn<IInquiry>[] = [
    {
      header: '#',
      headerClassName: 'w-12 text-center',
      className: 'text-center font-bold text-gray-400',
      cell: (_, idx) => (page - 1) * limit + idx + 1,
    },
    {
      header: 'Customer Name',
      cell: (inq) => (
        <div>
          <span className="font-sans text-xs font-bold text-gray-900 block">{inq.name}</span>
          {inq.email && (
            <a href={`mailto:${inq.email}`} className="text-gray-500 text-[11px] font-sans hover:underline">
              {inq.email}
            </a>
          )}
        </div>
      ),
    },
    {
      header: 'Contact Phone',
      cell: (inq) => (
        <a href={`tel:${inq.phone}`} className="text-gray-900 hover:text-black font-semibold flex items-center gap-1.5">
          <Phone className="w-3.5 h-3.5 text-gray-400" />
          <span>{inq.phone}</span>
        </a>
      ),
    },
    {
      header: 'Category',
      cell: (inq) => <span className="font-bold uppercase tracking-wider text-black">{inq.productCategory}</span>,
    },
    {
      header: 'Inquiry Message',
      cell: (inq) => <span className="text-gray-600 max-w-xs leading-relaxed inline-block">"{inq.message}"</span>,
    },
    {
      header: 'Status & Action',
      cell: (inq) => (
        <select
          value={inq.status || 'new'}
          onChange={(e) => handleStatusChange((inq._id || inq.id)!, e.target.value)}
          className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-gray-200 focus:outline-none cursor-pointer ${
            inq.status === 'resolved'
              ? 'bg-green-100 text-green-800'
              : inq.status === 'contacted'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          <option value="new">New Lead</option>
          <option value="contacted">Contacted</option>
          <option value="resolved">Resolved</option>
        </select>
      ),
    },
  ];

  return (
    <DataTable
      title="Customer Lead Inquiries"
      subtitle="Review and follow up on quotes requested from the public website."
      data={inquiries}
      columns={columns}
      keyExtractor={(inq, idx) => inq._id || inq.id || String(idx)}
      loading={loading}
      emptyMessage="No customer lead inquiries found matching filter query."
      search={search}
      onSearchChange={(val) => {
        setSearch(val);
        setPage(1);
      }}
      searchPlaceholder="Search leads by name, phone, or category..."
      filters={
        <Select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="w-48"
        >
          <option value="all">All Lead Statuses</option>
          <option value="new">New Leads</option>
          <option value="contacted">Contacted</option>
          <option value="resolved">Resolved</option>
        </Select>
      }
      actions={
        <Button variant="outline" size="sm" onClick={loadInquiries} title="Refresh leads">
          <RefreshCw className="w-4 h-4" />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
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
  );
};
