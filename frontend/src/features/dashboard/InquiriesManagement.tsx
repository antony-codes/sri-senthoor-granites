import React, { useState, useEffect } from 'react';
import { Phone, Mail, RefreshCw, Search } from 'lucide-react';
import { IInquiry } from '@/types';
import { fetchInquiriesPaginated, updateInquiryStatusApi } from '@/services/api';
import { Pagination } from '@/components/common/Pagination';

export const InquiriesManagement: React.FC = () => {
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
      loadInquiries();
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Title Header */}
      <div className="flex justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-5">
        <div>
          <h2 className="font-sans text-2xl font-bold text-gray-900">Customer Lead Inquiries</h2>
          <p className="text-xs text-gray-500 mt-1">Review and follow up on quotes requested from the public website.</p>
        </div>
        <button
          onClick={loadInquiries}
          className="p-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          title="Refresh leads"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search leads by name, phone, or category..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-black text-gray-900 font-sans"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-3.5 py-2 bg-gray-50 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-black text-gray-900 font-semibold font-sans cursor-pointer"
          >
            <option value="all">All Lead Statuses</option>
            <option value="new">New Leads</option>
            <option value="contacted">Contacted</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Inquiries Data Table */}
      {loading ? (
        <div className="py-12 text-center text-sm text-gray-500">Loading inquiries...</div>
      ) : inquiries.length === 0 ? (
        <div className="py-16 text-center text-sm text-gray-500">No customer lead inquiries found matching filter query.</div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700 font-sans">
              <thead className="bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-200">
                <tr>
                  <th className="py-3.5 px-4 w-12 text-center">#</th>
                  <th className="py-3.5 px-6">Customer Name</th>
                  <th className="py-3.5 px-4">Contact Phone</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-6">Inquiry Message</th>
                  <th className="py-3.5 px-4">Status & Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {inquiries.map((inq, idx) => (
                  <tr key={inq._id || inq.id || idx} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 text-center font-bold text-xs text-gray-400">{(page - 1) * limit + idx + 1}</td>
                    <td className="py-4 px-6">
                      <span className="font-sans text-sm font-bold text-gray-900 block">{inq.name}</span>
                      {inq.email && (
                        <a href={`mailto:${inq.email}`} className="text-gray-500 text-[11px] font-sans hover:underline">
                          {inq.email}
                        </a>
                      )}
                    </td>
                    <td className="py-4 px-4 font-sans font-semibold">
                      <a href={`tel:${inq.phone}`} className="text-gray-900 hover:text-black flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        <span>{inq.phone}</span>
                      </a>
                    </td>
                    <td className="py-4 px-4 font-bold uppercase tracking-wider text-black">
                      {inq.productCategory}
                    </td>
                    <td className="py-4 px-6 text-gray-600 max-w-xs leading-relaxed">
                      "{inq.message}"
                    </td>
                    <td className="py-4 px-4">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
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
      )}
    </div>
  );
};
