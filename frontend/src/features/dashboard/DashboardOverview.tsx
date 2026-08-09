import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, Package, MessageSquare, ArrowUpRight, TrendingUp, Sparkles } from 'lucide-react';
import { fetchCategories, fetchProducts, fetchInquiriesApi } from '@/services/api';
import { IInquiry } from '@/types';

export const DashboardOverview: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const [counts, setCounts] = useState({ categories: 5, products: 5, inquiries: 1 });
  const [recentLeads, setRecentLeads] = useState<IInquiry[]>([]);

  useEffect(() => {
    const loadCounts = async () => {
      try {
        const [cats, prods, inqs] = await Promise.all([
          fetchCategories(),
          fetchProducts(),
          fetchInquiriesApi(),
        ]);
        setCounts({
          categories: cats.length,
          products: prods.length,
          inquiries: inqs.length,
        });
        setRecentLeads(inqs.slice(0, 5));
      } catch {
        // Ignore
      }
    };
    loadCounts();
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Welcome Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Business Overview</h1>
        </div>

        <button
          onClick={() => onNavigate('products')}
          className="px-5 py-2.5 bg-black text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-all flex items-center gap-2 shadow-md"
        >
          <span>Manage Product Catalog</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric 1 */}
        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => onNavigate('products')}
          className="bg-white p-6 rounded-3xl border border-gray-200 flex flex-col justify-between cursor-pointer hover:border-black transition-all shadow-sm group"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Products</span>
            <div className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-900 group-hover:bg-black group-hover:text-white transition-colors">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-6 flex items-baseline justify-between">
            <span className="font-serif text-4xl font-extrabold text-gray-900">{counts.products}</span>
            <span className="text-xs text-green-700 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Storefront Active
            </span>
          </div>
        </motion.div>

        {/* Metric 2 */}
        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => onNavigate('categories')}
          className="bg-white p-6 rounded-3xl border border-gray-200 flex flex-col justify-between cursor-pointer hover:border-black transition-all shadow-sm group"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Active Categories</span>
            <div className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-900 group-hover:bg-black group-hover:text-white transition-colors">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-6 flex items-baseline justify-between">
            <span className="font-serif text-4xl font-extrabold text-gray-900">{counts.categories}</span>
            <span className="text-xs text-accent-gold font-bold">100% Active</span>
          </div>
        </motion.div>

        {/* Metric 3 */}
        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => onNavigate('inquiries')}
          className="bg-white p-6 rounded-3xl border border-gray-200 flex flex-col justify-between cursor-pointer hover:border-black transition-all shadow-sm group"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Customer Lead Inquiries</span>
            <div className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-900 group-hover:bg-black group-hover:text-white transition-colors">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-6 flex items-baseline justify-between">
            <span className="font-serif text-4xl font-extrabold text-gray-900">{counts.inquiries}</span>
            <span className="text-xs text-gray-500 font-semibold">Website Leads</span>
          </div>
        </motion.div>
      </div>

      {/* Recent Lead Inquiries Table Preview */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex justify-between items-center border-b border-gray-200 pb-4">
          <div>
            <h3 className="font-serif text-xl font-bold text-gray-900">Recent Customer Lead Quotes</h3>
            <p className="text-xs text-gray-500 mt-0.5">Quotations submitted directly from the Sri Senthoor Granites website.</p>
          </div>
          <button
            onClick={() => onNavigate('inquiries')}
            className="text-xs font-bold uppercase tracking-wider text-black hover:underline flex items-center gap-1"
          >
            <span>View All Leads</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentLeads.length === 0 ? (
          <div className="py-8 text-center text-xs text-gray-500">No customer lead inquiries captured yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-200 pb-2">
                <tr>
                  <th className="pb-3">Customer Name</th>
                  <th className="pb-3">Mobile Number</th>
                  <th className="pb-3">Interested Category</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentLeads.map((lead, idx) => (
                  <tr key={lead._id || lead.id || idx} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 font-semibold text-gray-900">{lead.name}</td>
                    <td className="py-3 font-mono">{lead.phone}</td>
                    <td className="py-3 uppercase tracking-wider text-accent-gold font-bold">{lead.productCategory}</td>
                    <td className="py-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${lead.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {lead.status || 'New Lead'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
