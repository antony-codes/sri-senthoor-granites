import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Square,
  LayoutDashboard,
  Package,
  Layers,
  MessageSquare,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Sparkles,
  Users,
  History,
  User,
  ChevronDown,
  Settings,
  ShieldCheck,
} from 'lucide-react';
import { removeAuthToken, getStoredUser, fetchInquiriesApi, fetchMyProfileApi } from '@/services/api';
import { DashboardOverview } from './DashboardOverview';
import { CategoryManagement } from './CategoryManagement';
import { ProductManagement } from './ProductManagement';
import { InquiriesManagement } from './InquiriesManagement';
import { UserManagement } from './UserManagement';
import { AuditLogManagement } from './AuditLogManagement';
import { UserProfileModal } from './UserProfileModal';
import { IUser } from '@/types';
import { COMPANY_INFO } from '@/constants/company';

interface DashboardLayoutProps {
  onLogout: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'categories' | 'products' | 'inquiries' | 'users' | 'audit'
  >('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [inquiryBadgeCount, setInquiryBadgeCount] = useState(0);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [user, setUser] = useState<IUser | null>(() => getStoredUser());
  const dropdownRef = useRef<HTMLDivElement>(null);

  const userRole = user?.role || 'super_admin';
  const userPermissions = user?.permissions || [];

  const canManageUsers =
    userRole === 'super_admin' || userRole === 'admin' || userPermissions.includes('users:manage') || userRole !== 'staff';
  const canReadAudit =
    userRole === 'super_admin' || userRole === 'admin' || userPermissions.includes('audit:read') || userRole !== 'staff';

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const u = await fetchMyProfileApi();
        if (u) setUser(u);
      } catch {
        // Fallback
      }
    };
    loadProfile();
  }, []);

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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogoutClick = () => {
    removeAuthToken();
    onLogout();
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'products', label: 'Products Catalog', icon: <Package className="w-4 h-4" /> },
    { id: 'categories', label: 'Categories', icon: <Layers className="w-4 h-4" /> },
    { id: 'inquiries', label: 'Lead Inquiries', icon: <MessageSquare className="w-4 h-4" />, badge: inquiryBadgeCount },
    ...(canManageUsers ? [{ id: 'users', label: 'Users & Access', icon: <Users className="w-4 h-4" /> }] : []),
    ...(canReadAudit ? [{ id: 'audit', label: 'Audit Logs', icon: <History className="w-4 h-4" /> }] : []),
  ];

  const getRoleLabel = (r: string) => {
    switch (r) {
      case 'super_admin':
        return 'Super Admin';
      case 'admin':
        return 'Admin';
      case 'staff':
        return 'Staff';
      default:
        return 'Super Admin';
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-50 text-gray-900 flex flex-col md:flex-row font-sans selection:bg-black selection:text-white">
      {/* 1. Sidebar - Fixed Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 h-full bg-white border-r border-gray-200 flex flex-col justify-between p-6 shrink-0 transition-transform duration-300 md:static md:translate-x-0 overflow-hidden ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-8">
          {/* Top Brand Emblem */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Square className="w-6 h-6 fill-current text-black stroke-none" />
              <div className="flex flex-col">
                <span className="font-serif text-lg font-bold tracking-tight text-black leading-tight">
                  SriSenthoor
                </span>
                <span className="text-[9px] uppercase tracking-widest text-black font-extrabold">
                  Management Portal
                </span>
              </div>
            </div>

            <button onClick={() => setMobileSidebarOpen(false)} className="md:hidden text-gray-500 hover:text-black">
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

        {/* Bottom Sidebar Storefront Link & Sign Out */}
        <div className="pt-6 border-t border-gray-200 space-y-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gray-100 border border-gray-200 hover:border-black text-xs text-gray-700 hover:text-black transition-all"
          >
            <span className="flex items-center gap-2 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-black" />
              <span>Live Storefront</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 hover:border-red-600 hover:bg-red-50 text-xs text-gray-600 hover:text-red-700 font-bold transition-all cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <LogOut className="w-3.5 h-3.5 text-gray-400 group-hover:text-red-600" />
              <span>Sign Out</span>
            </span>
          </button>
        </div>
      </aside>

      {/* 2. Main Area (Top Header + Dashboard Content) */}
      <div className="flex-1 h-full flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Navbar */}
        <header className="h-16 bg-white/95 backdrop-blur-md border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileSidebarOpen(true)} className="md:hidden p-2 text-gray-600 hover:text-black">
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="font-semibold text-gray-900 uppercase tracking-wider capitalize">
                {activeTab === 'users' ? 'Users & Access' : activeTab === 'audit' ? 'Audit Logs' : activeTab}
              </span>
            </div>
          </div>

          {/* Right Header Navigation & Profile Avatar Dropdown */}
          <div className="flex items-center gap-4 text-xs">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 border border-gray-200 hover:border-black text-gray-800 transition-all text-xs font-semibold"
            >
              <span>Storefront</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            {/* Profile Avatar & Interactive Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl border border-gray-200 hover:border-black bg-white transition-all shadow-sm cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-serif font-bold text-xs shrink-0 overflow-hidden border border-gray-300">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{user?.name ? user.name[0].toUpperCase() : 'A'}</span>
                  )}
                </div>

                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold text-gray-900 leading-tight truncate max-w-[120px]">
                    {user?.name || COMPANY_INFO.founder}
                  </span>
                  <span className="text-[9px] text-gray-500 uppercase font-extrabold">
                    {getRoleLabel(userRole)}
                  </span>
                </div>

                <ChevronDown
                  className={`w-4 h-4 text-gray-400 group-hover:text-black transition-transform ${
                    profileDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {profileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-gray-200 shadow-2xl p-2 z-50 font-sans space-y-1"
                  >
                    {/* User Header Details */}
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-serif font-bold text-sm shrink-0 overflow-hidden shadow-sm">
                        {user?.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <span>{user?.name ? user.name[0].toUpperCase() : 'A'}</span>
                        )}
                      </div>
                      <div className="flex flex-col truncate">
                        <span className="text-xs font-bold text-gray-900 truncate">{user?.name}</span>
                        <span className="text-[10px] text-gray-500 font-mono truncate">{user?.email}</span>
                        <span className="mt-1 inline-flex w-fit px-2 py-0.5 rounded text-[9px] font-extrabold uppercase bg-black text-white">
                          {getRoleLabel(userRole)}
                        </span>
                      </div>
                    </div>

                    <div className="py-1 border-t border-gray-100" />

                    {/* View / Edit Profile Button */}
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        setIsProfileModalOpen(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-gray-700 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <User className="w-4 h-4 text-gray-500" />
                      <span>View & Edit Profile</span>
                    </button>
                    <div className="py-1 border-t border-gray-100" />

                    {/* Sign Out Option */}
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        handleLogoutClick();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-red-600" />
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Content View */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          {activeTab === 'overview' && <DashboardOverview onNavigate={(t: any) => setActiveTab(t)} />}
          {activeTab === 'categories' && <CategoryManagement />}
          {activeTab === 'products' && <ProductManagement />}
          {activeTab === 'inquiries' && <InquiriesManagement />}
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'audit' && <AuditLogManagement />}
        </main>
      </div>

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={user}
        onProfileUpdated={(updated) => {
          setUser(updated);
        }}
      />
    </div>
  );
};
