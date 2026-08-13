import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Power, AlertTriangle } from 'lucide-react';
import { ICategory } from '@/types';
import { fetchCategoriesPaginated, createCategoryApi, updateCategoryApi, deleteCategoryApi } from '@/services/api';
import { Toast, ToastMessage } from '@/components/common/Toast';
import { DataTable, DataTableColumn } from '@/components/common/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog } from '@/components/ui/dialog';

export const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Pagination State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Toast State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Modals
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    icon: 'Layers',
    image: '',
    displayOrder: 1,
    isActive: true,
  });

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await fetchCategoriesPaginated(true, search, 'all', page, limit);
      setCategories(res.data);
      setTotalCount(res.totalCount);
      setTotalPages(res.totalPages);
    } catch (err: any) {
      addToast('error', 'Failed to load categories', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, [search, page, limit]);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      icon: 'Layers',
      image: '',
      displayOrder: categories.length + 1,
      isActive: true,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (cat: ICategory) => {
    setEditingCategory(cat);
    setFormData({
      title: cat.title,
      subtitle: cat.subtitle || '',
      description: cat.description || '',
      icon: cat.icon || 'Layers',
      image: cat.image || '',
      displayOrder: cat.displayOrder || 1,
      isActive: cat.isActive !== false,
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateCategoryApi(editingCategory.id, formData);
        addToast('success', 'Category Updated', `"${formData.title}" updated successfully.`);
      } else {
        await createCategoryApi(formData);
        addToast('success', 'Category Created', `"${formData.title}" created successfully.`);
      }
      setShowModal(false);
      loadCategories();
    } catch (err: any) {
      addToast('error', 'Error Saving Category', err.message);
    }
  };

  const handleToggleCategoryActive = async (cat: ICategory) => {
    const targetId = cat.id || cat._id || '';
    const nextActive = cat.isActive === false;
    try {
      setCategories((prev) =>
        prev.map((c) => (c.id === targetId || (c as any)._id === targetId ? { ...c, isActive: nextActive } : c))
      );
      await updateCategoryApi(targetId, { isActive: nextActive });
      addToast('success', 'Category Status Updated', `"${cat.title}" is now ${nextActive ? 'active' : 'disabled'}.`);
    } catch (err: any) {
      addToast('error', 'Failed to update category status', err.message);
      loadCategories();
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteCategoryApi(deleteTarget.id);
      addToast('success', 'Category Deleted', `"${deleteTarget.title}" was removed.`);
      setDeleteTarget(null);
      await loadCategories();
    } catch (err: any) {
      addToast('error', 'Error Deleting Category', err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Columns for DataTable
  const columns: DataTableColumn<ICategory>[] = [
    {
      header: '#',
      headerClassName: 'w-12 text-center',
      className: 'text-center font-bold text-gray-400',
      cell: (_, idx) => (page - 1) * limit + idx + 1,
    },
    {
      header: 'Category Name',
      cell: (cat) => <span className="font-bold text-gray-900">{cat.title}</span>,
    },
    {
      header: 'Subtitle',
      cell: (cat) => <span className="text-gray-500">{cat.subtitle || '—'}</span>,
    },
    {
      header: 'Visibility Status',
      cell: (cat) => {
        const isActive = cat.isActive !== false;
        return (
          <button
            type="button"
            onClick={() => handleToggleCategoryActive(cat)}
            className="cursor-pointer"
            title={isActive ? 'Click to disable category' : 'Click to enable category'}
          >
            <Badge variant={isActive ? 'success' : 'secondary'}>
              <Power className={`w-3 h-3 ${isActive ? 'text-emerald-700' : 'text-gray-400'}`} />
              <span>{isActive ? 'Active' : 'Disabled'}</span>
            </Badge>
          </button>
        );
      },
    },
    {
      header: 'Actions',
      headerClassName: 'text-right',
      className: 'text-right',
      cell: (cat) => (
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(cat)} title="Edit Category">
            <Edit2 className="w-4 h-4 text-gray-600" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setDeleteTarget({ id: cat.id, title: cat.title })} title="Delete Category">
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-sans relative">
      <Toast toasts={toasts} onDismiss={removeToast} />

      <DataTable
        title="Category Management"
        subtitle="Manage architectural product categories and toggle visibility on the website navigation."
        data={categories}
        columns={columns}
        keyExtractor={(cat, idx) => cat.id || cat._id || String(idx)}
        loading={loading}
        emptyMessage="No categories found matching filter query."
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        searchPlaceholder="Search categories..."
        actions={
          <Button variant="primary" size="default" onClick={handleOpenCreate}>
            <Plus className="w-4 h-4" />
            <span>Add New Category</span>
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

      {/* Edit / Create Category Dialog */}
      <Dialog
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingCategory ? 'Edit Category' : 'Create New Category'}
        description="Fill out the details below to configure category appearance."
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4 font-sans">
          <div>
            <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Title *</label>
            <Input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="e.g. Granites"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Subtitle</label>
            <Input
              type="text"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              placeholder="e.g. Premium Quarry Slabs"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 bg-gray-50/80 text-xs font-sans text-gray-900 focus:outline-none focus:border-black transition-colors"
              placeholder="Brief description of category"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Display Order</label>
              <Input
                type="number"
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
              />
            </div>
            <div className="flex-1 flex items-end mb-1">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-black rounded"
                />
                <span className="text-xs uppercase font-bold text-gray-700">Active</span>
              </label>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Category
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Category?"
        maxWidth="md"
      >
        <div className="space-y-6 text-center font-sans">
          <div className="w-14 h-14 rounded-2xl bg-red-100 border border-red-200 flex items-center justify-center mx-auto text-red-600 shadow-sm">
            <AlertTriangle className="w-7 h-7" />
          </div>

          <p className="text-xs text-gray-600 font-sans leading-relaxed">
            Are you sure you want to delete category <strong className="text-gray-900">"{deleteTarget?.title}"</strong>? Products linked to this category may lose their category grouping.
          </p>

          <div className="pt-2 flex justify-center gap-3">
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Yes, Delete Category'}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
