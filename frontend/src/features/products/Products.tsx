import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Grid, Square, Bath, Droplets, X, Eye, Check, Filter, ArrowUpRight } from 'lucide-react';
import { SectionHeader } from '@/components/common/SectionHeader';
import { IProduct, ICategory } from '@/types';
import { fetchCategories, fetchProducts, fetchSubCategories } from '@/services/api';

const ICON_MAP: Record<string, React.ReactNode> = {
  Layers: <Layers className="w-4 h-4" />,
  Grid: <Grid className="w-4 h-4" />,
  Square: <Square className="w-4 h-4" />,
  Bath: <Bath className="w-4 h-4" />,
  Droplets: <Droplets className="w-4 h-4" />,
};

const CATEGORY_IMAGES: Record<string, string> = {
  granites: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
  'vitrified-tiles': 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85',
  kadappa: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=85',
  'sanitary-wares': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1600&q=85',
  'bath-fittings': 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1600&q=85',
};

export const Products: React.FC = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [dynamicSubCategories, setDynamicSubCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeSubCategory, setActiveSubCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);

  const handleCategorySelect = (catId: string) => {
    setActiveCategory(catId);
    setActiveSubCategory('all');
  };

  useEffect(() => {
    const loadCatalog = async () => {
      setLoading(true);
      try {
        const [cats, prods, subs] = await Promise.all([
          fetchCategories(),
          activeCategory !== 'all' ? fetchProducts(activeCategory, activeSubCategory) : Promise.resolve([]),
          activeCategory !== 'all' ? fetchSubCategories(activeCategory) : Promise.resolve([]),
        ]);
        setCategories(cats);
        setProducts(prods);
        setDynamicSubCategories(subs);
      } catch {
        // Fallback
      } finally {
        setLoading(false);
      }
    };

    loadCatalog();
  }, [activeCategory, activeSubCategory]);

  const handleInquiry = () => {
    setSelectedProduct(null);
    const contactSec = document.getElementById('contact');
    if (contactSec) {
      contactSec.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const currentCategoryObj = categories.find((c) => c.id === activeCategory);

  return (
    <section id="products" className="py-12 sm:py-16 relative bg-white text-gray-900 font-sans border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          title="Architectural Stone"
          highlightTitle="Collections"
          subtitle="Discover natural granites, vitrified porcelain tiles, Kadappa black stone, and designer bathware."
        />

        {/* Top Category Filter Tabs */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-3 mb-10 no-scrollbar">
          <button
            onClick={() => handleCategorySelect('all')}
            className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-black text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-black'
            }`}
          >
            All Collections
          </button>

          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-black text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-black'
                }`}
              >
                {ICON_MAP[cat.icon] || <Layers className="w-3.5 h-3.5" />}
                <span>{cat.title}</span>
              </button>
            );
          })}
        </div>

        {/* VIEW 1: BENTO SHOWCASE GRID (When activeCategory === 'all') */}
        {activeCategory === 'all' && (
          <div className="space-y-10 font-sans">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat, idx) => {
                const bgImg = cat.image || CATEGORY_IMAGES[cat.id] || CATEGORY_IMAGES['granites'];
                const isHero = idx === 0;
                const formattedIndex = String(idx + 1).padStart(2, '0');

                return (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.08 }}
                    whileHover={{ y: -4 }}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`relative rounded-3xl overflow-hidden group cursor-pointer border border-gray-200 hover:border-black transition-all duration-300 shadow-sm hover:shadow-xl bg-black flex flex-col justify-between ${
                      isHero
                        ? 'md:col-span-2 lg:col-span-2 min-h-[340px] sm:min-h-[380px] p-6 sm:p-8'
                        : 'min-h-[300px] sm:min-h-[340px] p-6 sm:p-8'
                    }`}
                  >
                    <img
                      src={bgImg}
                      alt={cat.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-75 group-hover:scale-105 transition-all duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="font-sans text-[11px] font-bold text-white bg-black/70 px-2.5 py-0.5 rounded-full border border-white/20">
                          {formattedIndex}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider font-bold text-gray-300 hidden sm:inline">
                          {cat.subtitle || 'Architectural Stone'}
                        </span>
                      </div>

                      <div className="w-8 h-8 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-colors">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="relative z-10 space-y-2 pt-8">
                      <h3 className={`font-sans font-bold text-white group-hover:text-gray-200 transition-colors ${
                        isHero ? 'text-2xl sm:text-4xl' : 'text-xl sm:text-2xl'
                      }`}>
                        {cat.title}
                      </h3>

                      <p className="text-xs text-gray-300 font-sans line-clamp-2 leading-relaxed max-w-lg">
                        {cat.description}
                      </p>

                      <div className="pt-3 flex items-center justify-between border-t border-white/15 text-[11px] text-gray-300 font-semibold uppercase tracking-wider">
                        <span>View {cat.title}</span>
                        <span>↗</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 2: DEDICATED CATEGORY PRODUCT GRID */}
        {activeCategory !== 'all' && (
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-3 flex justify-between items-end">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-700 block">
                  Category: {currentCategoryObj?.title || activeCategory}
                </span>
                <h2 className="font-sans text-2xl font-bold text-gray-900 mt-0.5">
                  {currentCategoryObj?.subtitle || `${currentCategoryObj?.title} Products`}
                </h2>
              </div>
              <span className="text-xs text-gray-500 font-medium hidden sm:inline">
                {products.length} Products
              </span>
            </div>

            {dynamicSubCategories.length > 0 && (
              <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 border border-gray-200 text-xs font-semibold text-gray-600 shrink-0">
                  <Filter className="w-3 h-3 text-gray-700" /> Sub-Types:
                </div>

                <button
                  onClick={() => setActiveSubCategory('all')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                    activeSubCategory === 'all'
                      ? 'bg-black text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Items
                </button>

                {dynamicSubCategories.map((subName) => {
                  const isSubActive = activeSubCategory === subName;
                  return (
                    <button
                      key={subName}
                      onClick={() => setActiveSubCategory(subName)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                        isSubActive
                          ? 'bg-black text-white shadow-sm'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {subName}
                    </button>
                  );
                })}
              </div>
            )}

            {/* PRODUCT CARDS GRID */}
            {loading ? (
              <div className="py-16 text-center text-xs text-gray-500 font-sans">Loading category products...</div>
            ) : products.length === 0 ? (
              <div className="py-16 text-center text-xs text-gray-500 font-sans">No products available in this category.</div>
            ) : (
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                <AnimatePresence>
                  {products.map((product) => (
                    <motion.div
                      key={product.id || product._id}
                      layout
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.25 }}
                      onClick={() => setSelectedProduct(product)}
                      className="bg-white rounded-2xl overflow-hidden flex flex-col group border border-gray-200 hover:border-black transition-all shadow-sm hover:shadow-md cursor-pointer"
                    >
                      <div className="relative h-44 overflow-hidden bg-gray-100 shrink-0">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-40" />

                        {product.subCategory && (
                          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-wider bg-black/80 text-white backdrop-blur-sm">
                            {product.subCategory}
                          </div>
                        )}

                        <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-green-600 text-white flex items-center gap-1">
                          <Check className="w-2.5 h-2.5" />
                          <span>In Stock</span>
                        </div>
                      </div>

                      <div className="p-4 flex flex-col flex-grow justify-between space-y-3 font-sans">
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase tracking-wider text-gray-600 font-bold block truncate">
                            {product.subCategory || product.category}
                          </span>
                          <h3 className="font-sans text-base font-bold text-gray-900 line-clamp-1">
                            {product.title}
                          </h3>
                        </div>

                        <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                          <div className="font-sans text-xs font-bold text-gray-900">
                            ₹{product.offerPrice || product.price || 'Market Rate'}
                            <span className="text-[10px] text-gray-500 font-normal"> /{product.unit || 'sq.ft'}</span>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProduct(product);
                            }}
                            className="px-3 py-1.5 bg-black text-white font-bold text-[10px] uppercase tracking-wider rounded-lg hover:bg-gray-800 transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Details</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* PRODUCT DETAIL MODAL SHEET */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white max-w-2xl w-full rounded-2xl overflow-hidden shadow-2xl relative max-h-[85vh] overflow-y-auto border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center text-gray-900 hover:text-black cursor-pointer border border-gray-200"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative h-60">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5 flex justify-between items-end">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-gray-300 font-bold">
                      {selectedProduct.subtitle || selectedProduct.subCategory}
                    </span>
                    <h2 className="font-sans text-2xl font-bold text-white">{selectedProduct.title}</h2>
                  </div>

                  <div className="bg-black/80 px-3.5 py-1.5 rounded-xl border border-white/20 text-right">
                    <span className="text-[9px] text-gray-300 uppercase block font-semibold">Price</span>
                    <span className="font-sans text-base font-bold text-white">
                      ₹{selectedProduct.offerPrice || selectedProduct.price} <span className="text-[10px] font-normal text-white">/{selectedProduct.unit || 'sq.ft'}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-5 font-sans text-xs">
                <p className="text-gray-600 leading-relaxed">{selectedProduct.description}</p>

                <div className="pt-3 border-t border-gray-100 flex justify-end gap-3">
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 font-bold rounded-xl text-xs hover:bg-gray-50 cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleInquiry}
                    className="px-5 py-2 bg-black text-white font-bold rounded-xl text-xs hover:bg-gray-800 transition-all cursor-pointer"
                  >
                    Request Quote for {selectedProduct.title}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
