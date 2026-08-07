import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, AlertTriangle, Power } from 'lucide-react';
import { ICategory } from '@/types';
import { fetchCategories, createCategoryApi, updateCategoryApi, deleteCategoryApi } from '@/services/api';
import { Toast, ToastMessage } from '@/components/common/Toast';

export const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Toast State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
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
      const data = await fetchCategories(true);
      setCategories(data);
    } catch (err: any) {
      addToast('error', 'Failed to load categories', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

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

  // Toggle Category Active/Inactive
  const handleToggleCategoryActive = async (cat: ICategory) => {
    const nextActive = cat.isActive === false;
    try {
      setCategories(prev => prev.map(c => (c.id === cat.id ? { ...c, isActive: nextActive } : c)));
      await updateCategoryApi(cat.id, { isActive: nextActive });
      addToast(
        'success',
        'Category Status Updated',
        `"${cat.title}" is now ${nextActive ? 'active' : 'disabled'}.`
      );
    } catch (err: any) {
      addToast('error', 'Failed to update category status', err.message);
      loadCategories();
    }
  };

  // Delete Category Handlers
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

  return (
    <div className="space-y-6 font-sans relative">
      <Toast toasts={toasts} onDismiss={removeToast} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-5">
        <div>
          <h2 className="font-serif text-2xl font-bold text-gray-900">Category Management</h2>
          <p className="text-xs text-gray-500 mt-1 font-sans">Manage architectural product categories and toggle visibility on the website navigation.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 bg-black text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-all flex items-center gap-2 shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add New Category
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-sm text-gray-500 font-sans">Loading category hierarchy...</div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700 font-sans">
              <thead className="bg-gray-50 text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4">Category Name</th>
                  <th className="px-6 py-4">Subtitle</th>
                  <th className="px-6 py-4">Visibility Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {categories.map((cat, idx) => {
                  const isActive = cat.isActive !== false;
                  return (
                    <tr key={cat.id || idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs font-semibold text-gray-500">#{cat.displayOrder || idx + 1}</td>
                      <td className="px-6 py-4 font-serif font-bold text-gray-900">{cat.title}</td>
                      <td className="px-6 py-4 text-xs text-gray-500">{cat.subtitle || '—'}</td>
                      
                      {/* Active / Inactive Toggle Pill */}
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleCategoryActive(cat)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                            isActive
                              ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                              : 'bg-gray-100 text-gray-500 border-gray-300 hover:bg-gray-200'
                          }`}
                          title={isActive ? 'Click to disable category' : 'Click to enable category'}
                        >
                          <Power className={`w-3 h-3 ${isActive ? 'text-green-600' : 'text-gray-400'}`} />
                          <span>{isActive ? 'Active' : 'Disabled'}</span>
                        </button>
                      </td>

                      <td className="px-6 py-4 text-right space-x-2">
                        <button onClick={() => handleOpenEdit(cat)} className="p-2 text-gray-600 hover:text-black cursor-pointer">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteTarget({ id: cat.id, title: cat.title })} className="p-2 text-red-500 hover:text-red-700 cursor-pointer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit / Create Category Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border border-gray-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-gray-200 pb-4">
              <h3 className="font-serif text-xl font-bold text-gray-900">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-black cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-sm font-sans">
              <div>
                <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:border-black"
                  placeholder="e.g. Granites"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:border-black"
                  placeholder="e.g. Premium Quarry Slabs"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:border-black"
                  placeholder="Brief description of category"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:border-black"
                  />
                </div>
                <div className="flex-1 flex items-end mb-2">
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

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-black text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-gray-800 cursor-pointer"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border border-gray-200 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl text-center font-sans">
            <div className="w-14 h-14 rounded-2xl bg-red-100 border border-red-200 flex items-center justify-center mx-auto text-red-600 shadow-sm">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="font-serif text-xl font-bold text-gray-900">Delete Category?</h3>
              <p className="text-xs text-gray-600 font-sans leading-relaxed">
                Are you sure you want to delete category <strong className="text-gray-900">"{deleteTarget.title}"</strong>? Products linked to this category may lose their category grouping.
              </p>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold uppercase tracking-wider text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-6 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-red-700 shadow-md cursor-pointer flex items-center gap-2"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
