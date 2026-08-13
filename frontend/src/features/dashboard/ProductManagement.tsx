import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Power, AlertTriangle } from 'lucide-react';
import { IProduct, ICategory } from '@/types';
import { fetchProductsPaginated, fetchCategories, createProductApi, updateProductApi, deleteProductApi } from '@/services/api';
import { Toast, ToastMessage } from '@/components/common/Toast';
import { DataTable, DataTableColumn } from '@/components/common/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Dialog } from '@/components/ui/dialog';

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

  const handleToggleStatus = async (product: IProduct) => {
    const nextStatus = product.status === 'active' ? 'draft' : 'active';
    const targetId = product.id || product._id;
    if (!targetId) return;

    try {
      setProducts((prev) =>
        prev.map((p) => (p.id === targetId || p._id === targetId ? { ...p, status: nextStatus } : p))
      );
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

  // Reusable DataTable Columns
  const columns: DataTableColumn<IProduct>[] = [
    {
      header: '#',
      headerClassName: 'w-12 text-center',
      className: 'text-center font-bold text-gray-400',
      cell: (_, idx) => (page - 1) * limit + idx + 1,
    },
    {
      header: 'Image',
      cell: (p) => (
        <img src={p.image} alt={p.title} className="w-12 h-12 rounded-xl object-cover border border-gray-200 shadow-2xs" />
      ),
    },
    {
      header: 'Product Title',
      cell: (p) => (
        <div>
          <span className="font-sans font-bold text-gray-900 block">{p.title}</span>
          <span className="text-xs text-gray-500">{p.subtitle || p.finish}</span>
        </div>
      ),
    },
    {
      header: 'Category & Sub-Type',
      cell: (p) => (
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-black block">
            {p.category}
          </span>
          {p.subCategory && (
            <span className="text-[11px] font-semibold text-gray-500 block">
              └ {p.subCategory}
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Pricing',
      cell: (p) => (
        <span className="font-sans font-semibold">
          {p.offerPrice ? (
            <span>₹{p.offerPrice} <span className="line-through text-gray-400">₹{p.price}</span> /{p.unit}</span>
          ) : (
            <span>₹{p.price || 'N/A'} /{p.unit}</span>
          )}
        </span>
      ),
    },
    {
      header: 'Visibility Status',
      cell: (p) => {
        const isActive = p.status === 'active';
        return (
          <button
            type="button"
            onClick={() => handleToggleStatus(p)}
            className="cursor-pointer"
            title={isActive ? 'Click to set to Draft' : 'Click to set to Active'}
          >
            <Badge variant={isActive ? 'success' : 'secondary'}>
              <Power className={`w-3 h-3 ${isActive ? 'text-emerald-700' : 'text-gray-400'}`} />
              <span>{isActive ? 'Active' : 'Draft'}</span>
            </Badge>
          </button>
        );
      },
    },
    {
      header: 'Actions',
      headerClassName: 'text-right',
      className: 'text-right',
      cell: (p) => (
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(p)} title="Edit Product">
            <Edit2 className="w-4 h-4 text-gray-600" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setDeleteTarget({ id: (p.id || p._id)!, title: p.title })} title="Delete Product">
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
        title="Product Catalog Management"
        subtitle="Add, edit, toggle visibility, or delete products displayed on the public website catalog."
        data={products}
        columns={columns}
        keyExtractor={(p, idx) => p.id || p._id || String(idx)}
        loading={loading}
        emptyMessage="No products found matching filter query."
        search={searchQuery}
        onSearchChange={(val) => {
          setSearchQuery(val);
          setPage(1);
        }}
        searchPlaceholder="Search products..."
        filters={
          <Select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPage(1);
            }}
            className="w-48"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </Select>
        }
        actions={
          <Button variant="primary" size="default" onClick={handleOpenCreate}>
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
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

      {/* Edit / Create Product Dialog Modal */}
      <Dialog
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingProduct ? 'Edit Product' : 'Create New Product'}
        description="Configure pricing, images, and material specifications."
        maxWidth="2xl"
      >
        <form onSubmit={handleSave} className="space-y-4 font-sans max-h-[75vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Product Title *</label>
              <Input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="e.g. Absolute Black Granite"
              />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Subtitle</label>
              <Input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="e.g. Mirror Polish Slab"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Category *</label>
              <Select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Sub-Category</label>
              <Input
                type="text"
                value={formData.subCategory}
                onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                placeholder="e.g. Countertop Slabs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Regular Price (₹) *</label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                required
              />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Offer Price (₹)</label>
              <Input
                type="number"
                value={formData.offerPrice}
                onChange={(e) => setFormData({ ...formData, offerPrice: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Unit</label>
              <Input
                type="text"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="sq.ft"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Finish Surface</label>
              <Input
                type="text"
                value={formData.finish}
                onChange={(e) => setFormData({ ...formData, finish: e.target.value })}
                placeholder="e.g. High Gloss Mirror"
              />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Thickness</label>
              <Input
                type="text"
                value={formData.thickness}
                onChange={(e) => setFormData({ ...formData, thickness: e.target.value })}
                placeholder="e.g. 18mm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Image URL</label>
            <Input
              type="text"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 bg-gray-50/80 text-xs font-sans text-gray-900 focus:outline-none focus:border-black transition-colors"
              placeholder="Detailed description of material characteristics..."
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Product
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Product?"
        maxWidth="md"
      >
        <div className="space-y-6 text-center font-sans">
          <div className="w-14 h-14 rounded-2xl bg-red-100 border border-red-200 flex items-center justify-center mx-auto text-red-600 shadow-sm">
            <AlertTriangle className="w-7 h-7" />
          </div>

          <p className="text-xs text-gray-600 font-sans leading-relaxed">
            Are you sure you want to delete product <strong className="text-gray-900">"{deleteTarget?.title}"</strong>? This item will be permanently removed from the website catalog.
          </p>

          <div className="pt-2 flex justify-center gap-3">
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Yes, Delete Product'}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
