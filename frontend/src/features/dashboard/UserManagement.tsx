import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  UserPlus,
  Search,
  ShieldCheck,
  Shield,
  KeyRound,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  X,
  Lock,
  Check,
  Clock,
} from 'lucide-react';
import { IUser, UserRole } from '@/types';
import {
  fetchUsersApi,
  createUserApi,
  updateUserApi,
  updateUserPermissionsApi,
  toggleUserActiveApi,
  resetUserPasswordApi,
  deleteUserApi,
} from '@/services/api';

const AVAILABLE_PERMISSIONS = [
  { id: 'products:manage', label: 'Manage Products (Create/Edit/Delete)', category: 'Products' },
  { id: 'products:price_update', label: 'Update Product Pricing & Offers', category: 'Products' },
  { id: 'categories:manage', label: 'Manage Categories & Status', category: 'Categories' },
  { id: 'gallery:manage', label: 'Manage Gallery Slabs', category: 'Media' },
  { id: 'testimonials:manage', label: 'Manage Endorsements', category: 'Content' },
  { id: 'inquiries:manage', label: 'Manage Customer Leads & Status', category: 'Leads' },
  { id: 'users:manage', label: 'Manage Users, Roles & Permissions', category: 'System' },
  { id: 'audit:read', label: 'View System Audit Logs', category: 'System' },
];

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalUser, setEditModalUser] = useState<IUser | null>(null);
  const [permModalUser, setPermModalUser] = useState<IUser | null>(null);
  const [passwordModalUser, setPasswordModalUser] = useState<IUser | null>(null);

  // Form States
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'staff' as UserRole,
    permissions: [] as string[],
  });
  const [editFormData, setEditFormData] = useState({ name: '', email: '', role: 'staff' as UserRole });
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [newPassword, setNewPassword] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchUsersApi(search, roleFilter, statusFilter);
      setUsers(data);
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [search, roleFilter, statusFilter]);

  // Create User
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setErrorMsg('');
    try {
      await createUserApi(formData);
      setCreateModalOpen(false);
      setFormData({ name: '', email: '', password: '', role: 'staff', permissions: [] });
      await loadUsers();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create user');
    } finally {
      setActionLoading(false);
    }
  };

  // Edit User
  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModalUser) return;
    setActionLoading(true);
    setErrorMsg('');
    try {
      await updateUserApi(editModalUser._id || editModalUser.id || '', editFormData);
      setEditModalUser(null);
      await loadUsers();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update user');
    } finally {
      setActionLoading(false);
    }
  };

  // Save Custom Permissions
  const handleSavePermissions = async () => {
    if (!permModalUser) return;
    setActionLoading(true);
    setErrorMsg('');
    try {
      await updateUserPermissionsApi(permModalUser._id || permModalUser.id || '', selectedPermissions);
      setPermModalUser(null);
      await loadUsers();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update permissions');
    } finally {
      setActionLoading(false);
    }
  };

  // Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordModalUser) return;
    setActionLoading(true);
    setErrorMsg('');
    try {
      await resetUserPasswordApi(passwordModalUser._id || passwordModalUser.id || '', newPassword);
      setPasswordModalUser(null);
      setNewPassword('');
      alert('Password has been reset successfully.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to reset password');
    } finally {
      setActionLoading(false);
    }
  };

  // Toggle Active
  const handleToggleActive = async (user: IUser) => {
    const targetId = user._id || user.id || '';
    try {
      const updated = await toggleUserActiveApi(targetId, !user.isActive);
      setUsers((prev) => prev.map((u) => ((u._id || u.id) === targetId ? { ...u, isActive: updated.isActive } : u)));
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  // Delete User
  const handleDeleteUser = async (user: IUser) => {
    if (!window.confirm(`Are you sure you want to delete user account "${user.name}"?`)) return;
    const targetId = user._id || user.id || '';
    try {
      await deleteUserApi(targetId);
      setUsers((prev) => prev.filter((u) => (u._id || u.id) !== targetId));
    } catch (err: any) {
      alert(err.message || 'Failed to delete user');
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'super_admin':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-black text-white border border-gray-800 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-white" />
            <span>Super Admin</span>
          </span>
        );
      case 'admin':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-gray-100 text-gray-900 border border-gray-300 flex items-center gap-1">
            <Shield className="w-3 h-3 text-black" />
            <span>Admin</span>
          </span>
        );
      case 'staff':
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase bg-white text-gray-700 border border-gray-200">
            Staff User
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Title & Top Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900 tracking-tight">Users & Access Management</h1>
          <p className="text-xs text-gray-500 mt-1">Manage portal accounts, role-based access, and granular user permissions.</p>
        </div>

        <button
          onClick={() => {
            setFormData({ name: '', email: '', password: '', role: 'staff', permissions: [] });
            setErrorMsg('');
            setCreateModalOpen(true);
          }}
          className="px-5 py-2.5 bg-black text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-all flex items-center gap-2 shadow-md cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite / Create User</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-black text-gray-900"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto">
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-black text-gray-900 font-semibold"
          >
            <option value="all">All Roles</option>
            <option value="super_admin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-black text-gray-900 font-semibold"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="disabled">Disabled Only</option>
          </select>
        </div>
      </div>

      {/* Users Data Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-xs text-gray-500">Loading user accounts...</div>
        ) : users.length === 0 ? (
          <div className="py-12 text-center text-xs text-gray-500">No user accounts found matching query.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="py-3.5 px-6">User Details</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Account Status</th>
                  <th className="py-3.5 px-4">Last Login</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((u) => {
                  const targetId = u._id || u.id || '';
                  const initialChar = u.name ? u.name[0].toUpperCase() : 'U';

                  return (
                    <tr key={targetId} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center font-serif font-bold text-xs shrink-0 shadow-sm">
                            {initialChar}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-900 text-sm">{u.name}</span>
                            <span className="text-gray-500 font-mono text-[11px]">{u.email}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">{getRoleBadge(u.role)}</td>

                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleToggleActive(u)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase cursor-pointer transition-colors ${
                            u.isActive
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          {u.isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          <span>{u.isActive ? 'Active' : 'Disabled'}</span>
                        </button>
                      </td>

                      <td className="py-4 px-4 font-mono text-gray-500 text-[11px]">
                        {u.lastLogin ? (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-gray-400" />
                            {new Date(u.lastLogin).toLocaleString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        ) : (
                          'Never'
                        )}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Custom Permissions */}
                          <button
                            onClick={() => {
                              setPermModalUser(u);
                              setSelectedPermissions(u.permissions || []);
                              setErrorMsg('');
                            }}
                            title="Manage Individual Permissions"
                            className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-black hover:border-black transition-all cursor-pointer"
                          >
                            <Lock className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit Details */}
                          <button
                            onClick={() => {
                              setEditModalUser(u);
                              setEditFormData({ name: u.name, email: u.email, role: u.role });
                              setErrorMsg('');
                            }}
                            title="Edit Details & Role"
                            className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-black hover:border-black transition-all cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Reset Password */}
                          <button
                            onClick={() => {
                              setPasswordModalUser(u);
                              setNewPassword('');
                              setErrorMsg('');
                            }}
                            title="Reset User Password"
                            className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-black hover:border-black transition-all cursor-pointer"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete User */}
                          <button
                            onClick={() => handleDeleteUser(u)}
                            title="Delete User"
                            className="p-1.5 rounded-lg border border-gray-200 text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 1. CREATE USER MODAL */}
      <AnimatePresence>
        {createModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white max-w-lg w-full rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-2xl relative"
            >
              <button
                onClick={() => setCreateModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-black hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="font-serif text-2xl font-bold text-gray-900 mb-1">Create User Account</h3>
              <p className="text-xs text-gray-500 mb-6">Invite a team member with role-based dashboard privileges.</p>

              {errorMsg && <div className="p-3 mb-4 rounded-xl bg-red-50 text-red-700 text-xs font-semibold">{errorMsg}</div>}

              <form onSubmit={handleCreateUser} className="space-y-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-gray-700 font-bold block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Arshath Vijay"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-gray-50 text-xs border border-gray-200 focus:outline-none focus:border-black text-gray-900"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-gray-700 font-bold block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="user@srisenthoorgranites.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-gray-50 text-xs border border-gray-200 focus:outline-none focus:border-black text-gray-900"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-gray-700 font-bold block mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-gray-50 text-xs border border-gray-200 focus:outline-none focus:border-black text-gray-900"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-gray-700 font-bold block mb-1">Assign System Role *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                    className="w-full px-3.5 py-2 rounded-xl bg-gray-50 text-xs border border-gray-200 focus:outline-none focus:border-black text-gray-900 font-semibold"
                  >
                    <option value="super_admin">Super Admin (Full Access to Everything)</option>
                    <option value="admin">Admin (Manage Products, Categories, Gallery, Leads)</option>
                    <option value="staff">Staff (View Products, Manage Leads)</option>
                  </select>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setCreateModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-5 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-gray-800 cursor-pointer"
                  >
                    {actionLoading ? 'Creating...' : 'Create User'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. EDIT USER MODAL */}
      <AnimatePresence>
        {editModalUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white max-w-lg w-full rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-2xl relative"
            >
              <button
                onClick={() => setEditModalUser(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-black hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="font-serif text-2xl font-bold text-gray-900 mb-1">Edit User Profile</h3>
              <p className="text-xs text-gray-500 mb-6">Modify user details and change assigned system role.</p>

              {errorMsg && <div className="p-3 mb-4 rounded-xl bg-red-50 text-red-700 text-xs font-semibold">{errorMsg}</div>}

              <form onSubmit={handleEditUser} className="space-y-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-gray-700 font-bold block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-gray-50 text-xs border border-gray-200 focus:outline-none focus:border-black text-gray-900"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-gray-700 font-bold block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-gray-50 text-xs border border-gray-200 focus:outline-none focus:border-black text-gray-900"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-gray-700 font-bold block mb-1">Role</label>
                  <select
                    value={editFormData.role}
                    onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value as UserRole })}
                    className="w-full px-3.5 py-2 rounded-xl bg-gray-50 text-xs border border-gray-200 focus:outline-none focus:border-black text-gray-900 font-semibold"
                  >
                    <option value="super_admin">Super Admin</option>
                    <option value="admin">Admin</option>
                    <option value="staff">Staff</option>
                  </select>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setEditModalUser(null)}
                    className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-5 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-gray-800 cursor-pointer"
                  >
                    {actionLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. CUSTOM PERMISSIONS MODAL */}
      <AnimatePresence>
        {permModalUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white max-w-xl w-full rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-2xl relative max-h-[85vh] overflow-y-auto"
            >
              <button
                onClick={() => setPermModalUser(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-black hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="font-serif text-2xl font-bold text-gray-900 mb-1">
                Custom Permissions: {permModalUser.name}
              </h3>
              <p className="text-xs text-gray-500 mb-6">
                Assign or revoke individual permissions for this specific user.
              </p>

              {errorMsg && <div className="p-3 mb-4 rounded-xl bg-red-50 text-red-700 text-xs font-semibold">{errorMsg}</div>}

              <div className="space-y-3 mb-6">
                {AVAILABLE_PERMISSIONS.map((perm) => {
                  const isChecked = selectedPermissions.includes(perm.id);

                  return (
                    <label
                      key={perm.id}
                      onClick={() => {
                        if (isChecked) {
                          setSelectedPermissions(selectedPermissions.filter((p) => p !== perm.id));
                        } else {
                          setSelectedPermissions([...selectedPermissions, perm.id]);
                        }
                      }}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        isChecked ? 'border-black bg-gray-50 shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-900">{perm.label}</span>
                        <span className="text-[10px] text-gray-400 uppercase font-mono">{perm.id} • {perm.category}</span>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                          isChecked ? 'bg-black border-black text-white' : 'border-gray-300 bg-white'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </label>
                  );
                })}
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setPermModalUser(null)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePermissions}
                  disabled={actionLoading}
                  className="px-5 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-gray-800 cursor-pointer"
                >
                  {actionLoading ? 'Saving...' : 'Update Permissions'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. RESET PASSWORD MODAL */}
      <AnimatePresence>
        {passwordModalUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white max-w-md w-full rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-2xl relative"
            >
              <button
                onClick={() => setPasswordModalUser(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-black hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="font-serif text-2xl font-bold text-gray-900 mb-1">Reset Password</h3>
              <p className="text-xs text-gray-500 mb-6">Enter new password for user <strong>{passwordModalUser.name}</strong>.</p>

              {errorMsg && <div className="p-3 mb-4 rounded-xl bg-red-50 text-red-700 text-xs font-semibold">{errorMsg}</div>}

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-gray-700 font-bold block mb-1">New Password *</label>
                  <input
                    type="password"
                    required
                    minLength={4}
                    placeholder="Enter at least 4 characters..."
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-gray-50 text-xs border border-gray-200 focus:outline-none focus:border-black text-gray-900"
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setPasswordModalUser(null)}
                    className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-5 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-gray-800 cursor-pointer"
                  >
                    {actionLoading ? 'Resetting...' : 'Reset Password'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
