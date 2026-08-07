import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Square, LayoutDashboard, Package, Layers, MessageSquare, ExternalLink, LogOut, User, Menu, X, Sparkles } from 'lucide-react';
import { removeAuthToken, getStoredUser, fetchInquiriesApi } from '@/services/api';
import { DashboardOverview } from './DashboardOverview';
import { CategoryManagement } from './CategoryManagement';
import { ProductManagement } from './ProductManagement';
import { InquiriesManagement } from './InquiriesManagement';
import { COMPANY_INFO } from '@/constants/company';

interface DashboardLayoutProps {
  onLogout: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'categories' | 'products' | 'inquiries'>('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [inquiryBadgeCount, setInquiryBadgeCount] = useState(0);
  const user = getStoredUser();

  useEffect(() => {
    const checkLeads = async () => {
      try {
        const leads = await fetchInquiriesApi();
        const newLeads = leads.filter((l) => l.status === 'new' || !l.status);
        setInquiryBadgeCount(newLeads.length);
      } catch {
        // Ignore
      }
    };
    checkLeads();
  }, [activeTab]);

  const handleLogoutClick = () => {
    removeAuthToken();
    onLogout();
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'products', label: 'Products Catalog', icon: <Package className="w-4 h-4" /> },
    { id: 'categories', label: 'Categories', icon: <Layers className="w-4 h-4" /> },
    { id: 'inquiries', label: 'Lead Inquiries', icon: <MessageSquare className="w-4 h-4" />, badge: inquiryBadgeCount },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col md:flex-row font-sans selection:bg-accent-gold selection:text-white">
      {/* 1. Sidebar - Desktop & Responsive Mobile Drawer */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 flex flex-col justify-between p-6 transition-transform duration-300 md:static md:translate-x-0 ${
        mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="space-y-8">
          {/* Top Brand Emblem */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Square className="w-6 h-6 fill-current text-black stroke-none" />
              <div className="flex flex-col">
                <span className="font-serif text-lg font-bold tracking-tight text-black leading-tight">
                  SriSenthoor
                </span>
                <span className="text-[9px] uppercase tracking-widest text-accent-gold font-bold">
                  Management Portal
                </span>
              </div>
            </div>

            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="md:hidden text-gray-500 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links with Active Indicator */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setMobileSidebarOpen(false);
                  }}
                  className={`relative w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                    isActive ? 'text-white font-extrabold' : 'text-gray-600 hover:text-black hover:bg-gray-100'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeDashboardTab"
                      className="absolute inset-0 bg-black rounded-xl shadow-md"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </span>

                  {item.badge && item.badge > 0 ? (
                    <span className="relative z-10 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-500 text-white shadow-sm">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar Profile & Store Link */}
        <div className="pt-6 border-t border-gray-200 space-y-4">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gray-100 border border-gray-200 hover:border-black text-xs text-gray-700 hover:text-black transition-all"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-accent-gold" />
              <span>Live Storefront</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-accent-gold/20 border border-accent-gold flex items-center justify-center text-accent-gold font-serif font-bold text-xs shrink-0">
                {user?.name ? user.name[0] : 'A'}
              </div>
              <div className="flex flex-col truncate">
                <span className="text-xs font-bold text-gray-900 truncate">{user?.name || COMPANY_INFO.founder}</span>
                <span className="text-[10px] text-accent-gold uppercase font-semibold">Founder & Owner</span>
              </div>
            </div>

            <button
              onClick={handleLogoutClick}
              title="Sign Out"
              className="p-2 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. Main Area (Top Header + Dashboard Content) */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white/90 backdrop-blur-md border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 text-gray-600 hover:text-black"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="font-semibold text-gray-900 uppercase tracking-wider capitalize">{activeTab}</span>
              <span>/</span>
              <span className="text-gray-500">Sri Senthoor Control Center</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 border border-green-200 text-green-800 text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" />
              <span>Real-Time Catalog Sync</span>
            </div>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 border border-gray-200 hover:border-black text-gray-800 transition-all text-xs font-semibold"
            >
              <span>View Storefront</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </header>

        {/* Content View */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          {activeTab === 'overview' && <DashboardOverview onNavigate={(t: any) => setActiveTab(t)} />}
          {activeTab === 'categories' && <CategoryManagement />}
          {activeTab === 'products' && <ProductManagement />}
          {activeTab === 'inquiries' && <InquiriesManagement />}
        </main>
      </div>
    </div>
  );
};
