import React, { useEffect, useState } from 'react';
import {
  UserPlus,
  ShieldCheck,
  KeyRound,
  Trash2,
  Edit2,
  Lock,
} from 'lucide-react';
import { IUser, UserRole } from '@/types';
import {
  fetchUsersPaginated,
  createUserApi,
  updateUserApi,
  updateUserPermissionsApi,
  toggleUserActiveApi,
  resetUserPasswordApi,
  deleteUserApi,
} from '@/services/api';
import { DataTable, DataTableColumn } from '@/components/common/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Dialog } from '@/components/ui/dialog';

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

  // Pagination State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

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
      const res = await fetchUsersPaginated(search, roleFilter, statusFilter, page, limit);
      setUsers(res.data);
      setTotalCount(res.totalCount);
      setTotalPages(res.totalPages);
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [search, roleFilter, statusFilter, page, limit]);

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

  // Toggle User Active Status
  const handleToggleUserActive = async (user: IUser) => {
    try {
      const nextActive = user.isActive === false;
      await toggleUserActiveApi(user._id || user.id || '', nextActive);
      await loadUsers();
    } catch (err: any) {
      alert(err.message || 'Failed to update user status');
    }
  };

  // Delete User
  const handleDeleteUser = async (user: IUser) => {
    if (!window.confirm(`Are you sure you want to delete user "${user.name}"?`)) return;
    try {
      await deleteUserApi(user._id || user.id || '');
      await loadUsers();
    } catch (err: any) {
      alert(err.message || 'Failed to delete user');
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'super_admin':
        return <Badge variant="default">Super Admin</Badge>;
      case 'admin':
        return <Badge variant="info">Admin</Badge>;
      case 'staff':
        return <Badge variant="secondary">Staff</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  // DataTable Columns
  const columns: DataTableColumn<IUser>[] = [
    {
      header: '#',
      headerClassName: 'w-12 text-center',
      className: 'text-center font-bold text-gray-400',
      cell: (_, idx) => (page - 1) * limit + idx + 1,
    },
    {
      header: 'User Profile',
      cell: (u) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-black text-white font-bold text-xs flex items-center justify-center shrink-0 overflow-hidden border border-gray-300">
            {u.avatar ? (
              <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
            ) : (
              <span>{u.name ? u.name[0].toUpperCase() : 'U'}</span>
            )}
          </div>
          <div>
            <span className="font-bold text-gray-900 block text-xs">{u.name}</span>
            <span className="text-gray-500 text-[11px] block">{u.email}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'System Role',
      cell: (u) => getRoleBadge(u.role),
    },
    {
      header: 'Permissions',
      cell: (u) => (
        <div className="flex items-center gap-1.5">
          <Badge variant="outline" className="text-[10px]">
            {u.role === 'super_admin' ? 'All System Access' : `${(u.permissions || []).length} Granular Custom`}
          </Badge>
          {u.role !== 'super_admin' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setPermModalUser(u);
                setSelectedPermissions(u.permissions || []);
              }}
              className="h-6 px-1.5 text-[10px]"
            >
              <ShieldCheck className="w-3 h-3 text-black" /> Edit
            </Button>
          )}
        </div>
      ),
    },
    {
      header: 'Status',
      cell: (u) => {
        const isActive = u.isActive !== false;
        return (
          <button type="button" onClick={() => handleToggleUserActive(u)} className="cursor-pointer">
            <Badge variant={isActive ? 'success' : 'secondary'}>
              {isActive ? 'Active' : 'Disabled'}
            </Badge>
          </button>
        );
      },
    },
    {
      header: 'Actions',
      headerClassName: 'text-right',
      className: 'text-right',
      cell: (u) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setEditModalUser(u);
              setEditFormData({ name: u.name, email: u.email, role: u.role });
            }}
            title="Edit User Info"
          >
            <Edit2 className="w-4 h-4 text-gray-600" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setPasswordModalUser(u);
              setNewPassword('');
            }}
            title="Reset Password"
          >
            <KeyRound className="w-4 h-4 text-amber-600" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(u)} title="Delete User">
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      <DataTable
        title="Users & Access Management"
        subtitle="Manage admin staff accounts, security roles, and granular feature access permissions."
        data={users}
        columns={columns}
        keyExtractor={(u, idx) => u._id || u.id || String(idx)}
        loading={loading}
        emptyMessage="No user accounts found matching query."
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        searchPlaceholder="Search users by name or email..."
        filters={
          <div className="flex items-center gap-2">
            <Select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(1);
              }}
              className="w-36"
            >
              <option value="all">All Roles</option>
              <option value="super_admin">Super Admin</option>
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
            </Select>

            <Select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-36"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Accounts</option>
              <option value="disabled">Disabled Accounts</option>
            </Select>
          </div>
        }
        actions={
          <Button variant="primary" size="default" onClick={() => setCreateModalOpen(true)}>
            <UserPlus className="w-4 h-4" />
            <span>Add New User</span>
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

      {/* Create User Dialog */}
      <Dialog
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New User Account"
        description="Add a new staff or admin user to access the management portal."
        maxWidth="lg"
      >
        <form onSubmit={handleCreateUser} className="space-y-4 font-sans">
          {errorMsg && <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">{errorMsg}</div>}
          <div>
            <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Full Name *</label>
            <Input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Ramesh Kumar"
            />
          </div>
          <div>
            <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Email Address *</label>
            <Input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="ramesh@srisenthoor.in"
            />
          </div>
          <div>
            <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Initial Password *</label>
            <Input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-xs uppercase font-bold text-gray-700 mb-1">System Role *</label>
            <Select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
            >
              <option value="staff">Staff (Limited Granular Access)</option>
              <option value="admin">Admin (Full Operational Control)</option>
              <option value="super_admin">Super Admin (System Owner)</option>
            </Select>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={actionLoading}>
              {actionLoading ? 'Creating...' : 'Create Account'}
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog
        isOpen={!!editModalUser}
        onClose={() => setEditModalUser(null)}
        title="Edit User Profile"
        maxWidth="md"
      >
        <form onSubmit={handleEditUser} className="space-y-4 font-sans">
          {errorMsg && <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">{errorMsg}</div>}
          <div>
            <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Full Name</label>
            <Input
              type="text"
              required
              value={editFormData.name}
              onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Email Address</label>
            <Input
              type="email"
              required
              value={editFormData.email}
              onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs uppercase font-bold text-gray-700 mb-1">System Role</label>
            <Select
              value={editFormData.role}
              onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value as UserRole })}
            >
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </Select>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={() => setEditModalUser(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={actionLoading}>
              {actionLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Permissions Modal */}
      <Dialog
        isOpen={!!permModalUser}
        onClose={() => setPermModalUser(null)}
        title={`Granular Permissions: ${permModalUser?.name}`}
        description="Select individual capabilities granted to this user."
        maxWidth="xl"
      >
        <div className="space-y-4 font-sans">
          {errorMsg && <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">{errorMsg}</div>}

          <div className="grid grid-cols-1 gap-2.5 max-h-64 overflow-y-auto pr-1">
            {AVAILABLE_PERMISSIONS.map((perm) => {
              const isChecked = selectedPermissions.includes(perm.id);
              return (
                <label
                  key={perm.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                    isChecked ? 'bg-gray-100 border-black font-bold text-black' : 'bg-gray-50 border-gray-200 text-gray-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedPermissions([...selectedPermissions, perm.id]);
                      } else {
                        setSelectedPermissions(selectedPermissions.filter((id) => id !== perm.id));
                      }
                    }}
                    className="w-4 h-4 rounded text-black"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs">{perm.label}</span>
                    <span className="text-[10px] text-gray-500 uppercase font-semibold">{perm.category} Module</span>
                  </div>
                </label>
              );
            })}
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <Button variant="outline" onClick={() => setPermModalUser(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSavePermissions} disabled={actionLoading}>
              {actionLoading ? 'Saving...' : 'Save Permissions'}
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog
        isOpen={!!passwordModalUser}
        onClose={() => setPasswordModalUser(null)}
        title={`Reset Password: ${passwordModalUser?.name}`}
        maxWidth="md"
      >
        <form onSubmit={handleResetPassword} className="space-y-4 font-sans">
          {errorMsg && <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">{errorMsg}</div>}
          <div>
            <label className="block text-xs uppercase font-bold text-gray-700 mb-1">New Password *</label>
            <Input
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password..."
            />
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={() => setPasswordModalUser(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={actionLoading}>
              {actionLoading ? 'Resetting...' : 'Set New Password'}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};
