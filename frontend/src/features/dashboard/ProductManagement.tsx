import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X, AlertTriangle, Power } from 'lucide-react';
import { IProduct, ICategory } from '@/types';
import { fetchProductsPaginated, fetchCategories, createProductApi, updateProductApi, deleteProductApi } from '@/services/api';
import { Toast, ToastMessage } from '@/components/common/Toast';

import { Pagination } from '@/components/common/Pagination';

export const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
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
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    category: 'vitrified-tiles',
    subCategory: 'Floor Tiles',
    description: '',
    price: 185,
    offerPrice: 165,
    unit: 'sq.ft',
    finish: 'High Gloss Polish',
    thickness: '18mm',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    stockStatus: 'in_stock' as 'in_stock' | 'out_of_stock' | 'on_order',
    status: 'active' as 'active' | 'draft' | 'archived',
    isFeatured: true,
    isPopular: true,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, catData] = await Promise.all([
        fetchProductsPaginated(selectedCategory, 'all', searchQuery, 'all', 'newest', page, limit),
        fetchCategories(true),
      ]);
      setProducts(prodRes.data);
      setTotalCount(prodRes.totalCount);
      setTotalPages(prodRes.totalPages);
      setCategories(catData);
    } catch (err: any) {
      addToast('error', 'Failed to load catalog', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCategory, searchQuery, page, limit]);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData({
      title: '',
      subtitle: '',
      category: categories[0]?.id || 'vitrified-tiles',
      subCategory: 'Floor Tiles',
      description: '',
      price: 150,
      offerPrice: 135,
      unit: 'sq.ft',
      finish: 'Mirror Polish',
      thickness: '18mm',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      stockStatus: 'in_stock',
      status: 'active',
      isFeatured: true,
      isPopular: true,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (p: IProduct) => {
    setEditingProduct(p);
    setFormData({
      title: p.title,
      subtitle: p.subtitle || '',
      category: p.category,
      subCategory: p.subCategory || '',
      description: p.description || '',
      price: p.price || 0,
      offerPrice: p.offerPrice || 0,
      unit: p.unit || 'sq.ft',
      finish: p.finish || '',
      thickness: p.thickness || '',
      image: p.image || '',
      stockStatus: p.stockStatus || 'in_stock',
      status: p.status || 'active',
      isFeatured: !!p.isFeatured,
      isPopular: !!p.isPopular,
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        features: ['Quarry Direct Select', 'High Gloss Polish', 'Zero Water Absorption'],
        specs: { finish: formData.finish, thickness: formData.thickness },
      };

      if (editingProduct) {
        const targetId = editingProduct.id || editingProduct._id!;
        await updateProductApi(targetId, payload);
        addToast('success', 'Product Updated', `"${formData.title}" updated successfully.`);
      } else {
        await createProductApi(payload);
        addToast('success', 'Product Created', `"${formData.title}" added to the catalog.`);
      }
      setShowModal(false);
      loadData();
    } catch (err: any) {
      addToast('error', 'Error Saving Product', err.message);
    }
  };

  // Toggle Active/Inactive Status
  const handleToggleStatus = async (product: IProduct) => {
    const nextStatus = product.status === 'active' ? 'draft' : 'active';
    const targetId = product.id || product._id;
    if (!targetId) return;

    try {
      setProducts(prev => prev.map(p => (p.id === targetId || p._id === targetId ? { ...p, status: nextStatus } : p)));
      await updateProductApi(targetId, { status: nextStatus });
      addToast(
        'success',
        'Visibility Updated',
        `"${product.title}" is now ${nextStatus === 'active' ? 'active on website' : 'hidden from website'}.`
      );
    } catch (err: any) {
      addToast('error', 'Status Update Failed', err.message);
      loadData();
    }
  };

  // Delete Handlers
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteProductApi(deleteTarget.id);
      addToast('success', 'Product Deleted', `"${deleteTarget.title}" was permanently removed.`);
      setDeleteTarget(null);
      await loadData();
    } catch (err: any) {
      addToast('error', 'Delete Failed', err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 font-sans relative">
      <Toast toasts={toasts} onDismiss={removeToast} />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-5">
        <div>
          <h2 className="font-sans text-2xl font-bold text-gray-900">Product Catalog Management</h2>
          <p className="text-xs text-gray-500 mt-1">Add, edit, toggle visibility, or delete products displayed on the public website catalog.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 bg-black text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-all flex items-center gap-2 shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </button>
      </div>

      {/* Filter & Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Categories
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === c.id
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {c.title}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-xs text-gray-900 focus:outline-none focus:border-black"
          />
        </div>
      </div>

      {/* Product Grid Table */}
      {loading ? (
        <div className="py-12 text-center text-sm text-gray-500">Loading catalog items...</div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="bg-gray-50 text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-4 w-12 text-center">#</th>
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Product Title</th>
                  <th className="px-6 py-4">Category & Sub-Type</th>
                  <th className="px-6 py-4">Pricing</th>
                  <th className="px-6 py-4">Visibility Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((p, idx) => {
                  const isActive = p.status === 'active';
                  const prodId = p.id || p._id!;

                  return (
                    <tr key={prodId || idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 text-center font-bold text-xs text-gray-400">{(page - 1) * limit + idx + 1}</td>
                      <td className="px-6 py-4">
                        <img src={p.image} alt={p.title} className="w-12 h-12 rounded-xl object-cover border border-gray-200" />
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-sans font-bold text-gray-900 block">{p.title}</span>
                        <span className="text-xs text-gray-500">{p.subtitle || p.finish}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-accent-gold block">
                          {p.category}
                        </span>
                        {p.subCategory && (
                          <span className="text-[11px] font-semibold text-gray-600 block">
                            └ {p.subCategory}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs font-sans font-semibold">
                        {p.offerPrice ? (
                          <span>₹{p.offerPrice} <span className="line-through text-gray-400">₹{p.price}</span> /{p.unit}</span>
                        ) : (
                          <span>₹{p.price || 'N/A'} /{p.unit}</span>
                        )}
                      </td>
                      {/* Active / Inactive Toggle Pill */}
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleStatus(p)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                            isActive
                              ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                              : 'bg-gray-100 text-gray-500 border-gray-300 hover:bg-gray-200'
                          }`}
                          title={isActive ? 'Click to deactivate (hide from website)' : 'Click to activate (show on website)'}
                        >
                          <Power className={`w-3 h-3 ${isActive ? 'text-green-600' : 'text-gray-400'}`} />
                          <span>{isActive ? 'Active' : 'Inactive'}</span>
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button onClick={() => handleOpenEdit(p)} className="p-2 text-gray-600 hover:text-black cursor-pointer">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteTarget({ id: prodId, title: p.title })} className="p-2 text-red-500 hover:text-red-700 cursor-pointer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Pagination
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
        </div>
      )}

      {/* Edit / Create Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border border-gray-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-200 pb-4">
              <h3 className="font-sans text-xl font-bold text-gray-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-black cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-sm font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Product Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:border-black"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Sub-Category Option</label>
                  <input
                    type="text"
                    value={formData.subCategory}
                    onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:border-black"
                    placeholder="e.g. Floor Tiles / Bathroom Tiles / Wall Tiles"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Subtitle / Grade</label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:border-black"
                    placeholder="e.g. Quarry Mirror Polish"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Offer Price (₹)</label>
                  <input
                    type="number"
                    value={formData.offerPrice}
                    onChange={(e) => setFormData({ ...formData, offerPrice: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Unit</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:border-black"
                    placeholder="sq.ft / piece"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Visibility Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:border-black font-bold"
                  >
                    <option value="active">Active (Visible on Website)</option>
                    <option value="draft">Inactive (Hidden from Website)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Image URL *</label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:border-black"
                />
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
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border border-gray-200 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-100 border border-red-200 flex items-center justify-center mx-auto text-red-600 shadow-sm">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="font-sans text-xl font-bold text-gray-900">Delete Product?</h3>
              <p className="text-xs text-gray-600 font-sans leading-relaxed">
                Are you sure you want to permanently delete <strong className="text-gray-900">"{deleteTarget.title}"</strong>? This product will be removed from both the database and public catalog.
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
                {isDeleting ? 'Deleting...' : 'Yes, Delete Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
