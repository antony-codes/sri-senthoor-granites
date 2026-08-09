import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Layers,
  Package,
  MessageSquare,
  ArrowUpRight,
  TrendingUp,
  Users,
  History,
  ShieldCheck,
  Clock,
  UserCheck,
} from 'lucide-react';
import { fetchCategories, fetchProducts, fetchInquiriesApi, fetchUsersApi, fetchAuditLogsApi } from '@/services/api';
import { IInquiry, IAuditLog } from '@/types';

export const DashboardOverview: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const [counts, setCounts] = useState({ categories: 5, products: 15, inquiries: 1, users: 3, auditLogs: 12 });
  const [recentLeads, setRecentLeads] = useState<IInquiry[]>([]);
  const [recentAuditLogs, setRecentAuditLogs] = useState<IAuditLog[]>([]);

  useEffect(() => {
    const loadOverviewData = async () => {
      try {
        const [cats, prods, inqs, usersList, auditRes] = await Promise.all([
          fetchCategories(),
          fetchProducts(),
          fetchInquiriesApi(),
          fetchUsersApi(),
          fetchAuditLogsApi('', 'all', 'all', 1, 5),
        ]);

        setCounts({
          categories: cats.length,
          products: prods.length,
          inquiries: inqs.length,
          users: usersList.length || 3,
          auditLogs: auditRes.totalCount || 12,
        });

        setRecentLeads(inqs.slice(0, 5));
        setRecentAuditLogs(auditRes.data.slice(0, 5));
      } catch {
        // Ignore
      }
    };
    loadOverviewData();
  }, []);

  return (
    <div className="space-y-8 font-sans">
      {/* Top Welcome Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="font-sans text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Business Overview</h1>
          <p className="text-xs text-gray-500 mt-1">Live analytics, access management, and system activity logs.</p>
        </div>
      </div>

      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1: Products */}
        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => onNavigate('products')}
          className="bg-white p-6 rounded-3xl border border-gray-200 flex flex-col justify-between cursor-pointer hover:border-black transition-all shadow-sm group"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Products Catalog</span>
            <div className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-900 group-hover:bg-black group-hover:text-white transition-colors">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-6 flex items-baseline justify-between">
            <span className="font-sans text-4xl font-extrabold text-gray-900">{counts.products}</span>
            <span className="text-xs text-green-700 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Active
            </span>
          </div>
        </motion.div>

        {/* Metric 2: Categories */}
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
            <span className="font-sans text-4xl font-extrabold text-gray-900">{counts.categories}</span>
            <span className="text-xs text-black font-bold">100% Active</span>
          </div>
        </motion.div>

        {/* Metric 3: Users & Access */}
        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => onNavigate('users')}
          className="bg-white p-6 rounded-3xl border border-gray-200 flex flex-col justify-between cursor-pointer hover:border-black transition-all shadow-sm group"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Users & Access</span>
            <div className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-900 group-hover:bg-black group-hover:text-white transition-colors">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-6 flex items-baseline justify-between">
            <span className="font-sans text-4xl font-extrabold text-gray-900">{counts.users}</span>
          </div>
        </motion.div>

        {/* Metric 4: Audit Logs */}
        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => onNavigate('audit')}
          className="bg-white p-6 rounded-3xl border border-gray-200 flex flex-col justify-between cursor-pointer hover:border-black transition-all shadow-sm group"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Audit Logs</span>
            <div className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-900 group-hover:bg-black group-hover:text-white transition-colors">
              <History className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-6 flex items-baseline justify-between">
            <span className="font-sans text-4xl font-extrabold text-gray-900">{counts.auditLogs}</span>
            <span className="text-xs text-gray-500 font-semibold">Real-Time</span>
          </div>
        </motion.div>
      </div>

      {/* Grid: Left - Customer Leads / Right - Recent Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Lead Inquiries Table */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex justify-between items-center border-b border-gray-200 pb-4">
            <div>
              <h3 className="font-sans text-xl font-bold text-gray-900">Recent Customer Lead Quotes</h3>
              <p className="text-xs text-gray-500 mt-0.5">Quotations submitted directly from the Sri Senthoor Granites website.</p>
            </div>
            <button
              onClick={() => onNavigate('inquiries')}
              className="text-xs font-bold uppercase tracking-wider text-black hover:underline flex items-center gap-1"
            >
              <span>View All</span>
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
                    <th className="pb-3 w-8 text-center">#</th>
                    <th className="pb-3">Customer Name</th>
                    <th className="pb-3">Mobile Number</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentLeads.map((lead, idx) => (
                    <tr key={lead._id || lead.id || idx} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 text-center font-bold text-gray-400">{idx + 1}</td>
                      <td className="py-3 font-semibold text-gray-900">{lead.name}</td>
                      <td className="py-3 font-sans">{lead.phone}</td>
                      <td className="py-3 uppercase tracking-wider text-black font-bold">{lead.productCategory}</td>
                      <td className="py-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            lead.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}
                        >
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

        {/* Right Column: Live Audit Feed Preview */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex justify-between items-center border-b border-gray-200 pb-4">
            <div>
              <h3 className="font-sans text-xl font-bold text-gray-900">Recent Audit Activity</h3>
              <p className="text-xs text-gray-500 mt-0.5">Real-time log of product edits, price updates & user management.</p>
            </div>
            <button
              onClick={() => onNavigate('audit')}
              className="text-xs font-bold uppercase tracking-wider text-black hover:underline flex items-center gap-1"
            >
              <span>Full Audit Logs</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentAuditLogs.length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-500">No audit activity logged yet.</div>
          ) : (
            <div className="space-y-3">
              {recentAuditLogs.map((log, idx) => (
                <div
                  key={log._id || idx}
                  className="p-3.5 rounded-2xl border border-gray-100 bg-gray-50/70 hover:border-black transition-colors flex flex-col justify-between gap-1"
                >
                  <span className="font-semibold text-xs text-gray-900">{log.action}</span>
                  <div className="flex justify-between items-center text-[10px] text-gray-500 font-sans pt-1 border-t border-gray-200/50">
                    <span>By: {log.userName}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
