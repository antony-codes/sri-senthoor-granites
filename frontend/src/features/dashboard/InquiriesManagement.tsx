import React, { useState, useEffect } from 'react';
import { Phone, Mail, RefreshCw } from 'lucide-react';
import { IInquiry } from '@/types';
import { fetchInquiriesApi, updateInquiryStatusApi } from '@/services/api';

export const InquiriesManagement: React.FC = () => {
  const [inquiries, setInquiries] = useState<IInquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadInquiries = async () => {
    setLoading(true);
    try {
      const data = await fetchInquiriesApi();
      setInquiries(data);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, []);

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
      <div className="flex justify-between items-center border-b border-gray-200 pb-5">
        <div>
          <h2 className="font-serif text-2xl font-bold text-gray-900">Customer Lead Inquiries</h2>
          <p className="text-xs text-gray-500 mt-1">Review and follow up on quotes requested from the public website.</p>
        </div>
        <button
          onClick={loadInquiries}
          className="p-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-sm text-gray-500">Loading inquiries...</div>
      ) : inquiries.length === 0 ? (
        <div className="py-16 text-center text-sm text-gray-500">No customer lead inquiries received yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {inquiries.map((inq, idx) => (
            <div
              key={inq._id || inq.id || idx}
              className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-sm hover:border-black transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs uppercase font-bold tracking-widest text-accent-gold block">
                    Category: {inq.productCategory}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-gray-900">{inq.name}</h3>
                </div>
                <select
                  value={inq.status || 'new'}
                  onChange={(e) => handleStatusChange(inq._id || inq.id!, e.target.value)}
                  className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-gray-200 focus:outline-none cursor-pointer ${
                    inq.status === 'resolved'
                      ? 'bg-green-100 text-green-800'
                      : inq.status === 'contacted'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  <option value="new">New Lead</option>
                  <option value="contacted">Contacted</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              <div className="p-3.5 rounded-xl bg-gray-50 text-xs text-gray-700 font-sans leading-relaxed border border-gray-100">
                "{inq.message}"
              </div>

              <div className="flex items-center justify-between pt-2 text-xs border-t border-gray-100">
                <a href={`tel:${inq.phone}`} className="font-semibold text-gray-900 hover:text-accent-gold flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-accent-gold" /> {inq.phone}
                </a>
                {inq.email && (
                  <a href={`mailto:${inq.email}`} className="text-gray-500 hover:underline flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" /> {inq.email}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
