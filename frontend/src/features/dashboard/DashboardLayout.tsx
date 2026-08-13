import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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

interface DashboardLayoutProps {
  onLogout: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const getActiveTab = (): 'overview' | 'categories' | 'products' | 'inquiries' | 'users' | 'audit' => {
    const path = location.pathname.toLowerCase();
    if (path.includes('/products')) return 'products';
    if (path.includes('/categories')) return 'categories';
    if (path.includes('/inquiries')) return 'inquiries';
    if (path.includes('/users')) return 'users';
    if (path.includes('/audit') || path.includes('/settings')) return 'audit';
    return 'overview';
  };

  const activeTab = getActiveTab();
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
        const newLeads = leads.filter((l) => l.status === 'new');
        setInquiryBadgeCount(newLeads.length);
      } catch {
        // Fallback
      }
    };

    checkLeads();
    const handleLeadChange = () => checkLeads();
    window.addEventListener('leadStatusChanged', handleLeadChange);
    return () => window.removeEventListener('leadStatusChanged', handleLeadChange);
  }, []);

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
    localStorage.removeItem('ssg_admin_user');
    onLogout();
  };

  const handleTabNavigate = (tabId: string) => {
    const targetPath = tabId === 'overview' ? '/dashboard' : `/dashboard/${tabId}`;
    navigate(targetPath);
    setMobileSidebarOpen(false);
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'products', label: 'Products', icon: <Package className="w-4 h-4" /> },
    { id: 'categories', label: 'Categories', icon: <Layers className="w-4 h-4" /> },
    { id: 'inquiries', label: 'Lead Inquiries', icon: <MessageSquare className="w-4 h-4" />, badge: inquiryBadgeCount },
    ...(canManageUsers ? [{ id: 'users', label: 'Users & Access', icon: <Users className="w-4 h-4" /> }] : []),
    ...(canReadAudit ? [{ id: 'audit', label: 'Audit Logs', icon: <History className="w-4 h-4" /> }] : []),
  ];

  const getRoleTitle = (role?: string) => {
    switch (role) {
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
                <span className="font-sans text-lg font-bold tracking-tight text-black leading-tight">
                  Sri Senthoor Granites
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
                  onClick={() => handleTabNavigate(item.id)}
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
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </span>
          </button>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Navbar */}
        <header className="h-20 bg-white border-b border-gray-200 px-6 md:px-10 flex items-center justify-between shrink-0 shadow-2xs">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl border border-gray-200 text-gray-700"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-black block">
                {activeTab}
              </span>
              <span className="text-[11px] text-gray-500 hidden sm:block">
                Sri Senthoor Granites Control Panel
              </span>
            </div>
          </div>

          {/* User Profile Menu */}
          <div className="flex items-center gap-4">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-3 p-1.5 pr-3 rounded-2xl border border-gray-200 hover:border-black transition-all cursor-pointer bg-gray-50"
              >
                <div className="w-8 h-8 rounded-xl bg-black text-white font-bold text-xs flex items-center justify-center overflow-hidden">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{user?.name ? user.name[0].toUpperCase() : 'A'}</span>
                  )}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold text-gray-900 leading-tight">
                    {user?.name || 'Administrator'}
                  </span>
                  <span className="text-[10px] text-gray-500 font-semibold uppercase">
                    {getRoleTitle(user?.role)}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {/* Profile Dropdown */}
              <AnimatePresence>
                {profileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-gray-200 shadow-2xl p-2 z-50 space-y-1 font-sans"
                  >
                    <div className="p-3 border-b border-gray-100 bg-gray-50 rounded-xl mb-1">
                      <p className="text-xs font-bold text-gray-900">{user?.name}</p>
                      <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        setIsProfileModalOpen(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-700 hover:text-black hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                    >
                      <User className="w-4 h-4 text-gray-400" />
                      <span>My Profile & Settings</span>
                    </button>

                    {canManageUsers && (
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          handleTabNavigate('users');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-700 hover:text-black hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4 text-gray-400" />
                        <span>Manage User Roles</span>
                      </button>
                    )}

                    <div className="pt-1 border-t border-gray-100">
                      <button
                        onClick={handleLogoutClick}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-red-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Content View */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          {activeTab === 'overview' && <DashboardOverview onNavigate={(t: string) => handleTabNavigate(t)} />}
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
