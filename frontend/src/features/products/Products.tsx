import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Grid, Square, Bath, Droplets, CheckCircle2, X, Eye, Check, Filter, ArrowUpRight, Sparkles } from 'lucide-react';
import { SectionHeader } from '@/components/common/SectionHeader';
import { MagneticButton } from '@/components/common/MagneticButton';
import { IProduct, ICategory } from '@/types';
import { fetchCategories, fetchProducts, fetchSubCategories } from '@/services/api';

const ICON_MAP: Record<string, React.ReactNode> = {
  Layers: <Layers className="w-5 h-5" />,
  Grid: <Grid className="w-5 h-5" />,
  Square: <Square className="w-5 h-5" />,
  Bath: <Bath className="w-5 h-5" />,
  Droplets: <Droplets className="w-5 h-5" />,
};

// High-definition luxury imagery for category showcases
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

  // Reset sub-category when active category changes
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

  const handleInquiry = (_productName: string) => {
    setSelectedProduct(null);
    const contactSec = document.getElementById('contact');
    if (contactSec) {
      contactSec.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const currentCategoryObj = categories.find(c => c.id === activeCategory);

  return (
    <section id="products" className="py-24 sm:py-32 relative bg-white text-gray-900 transition-colors font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          badge="Architectural Stone Collections"
          title="Explore Sri Senthoor Granites"
          highlightTitle="Product Categories"
          subtitle="Select a category to view specialized floor tiles, wall tiles, bathroom suites, natural black kadappa, and mirror-polished granites."
        />

        {/* Top Category Filter Tabs */}
        <div className="flex items-center justify-start sm:justify-center gap-2.5 overflow-x-auto pb-4 mb-12 no-scrollbar">
          <button
            onClick={() => handleCategorySelect('all')}
            className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap cursor-pointer ${activeCategory === 'all'
              ? 'bg-black text-white shadow-xl shadow-black/20'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-black'
              }`}
          >
            All Collections Gallery
          </button>

          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap flex items-center gap-2 cursor-pointer ${isActive
                  ? 'bg-black text-white shadow-xl shadow-black/20'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-black'
                  }`}
              >
                {ICON_MAP[cat.icon] || <Layers className="w-4 h-4" />}
                <span>{cat.title}</span>
              </button>
            );
          })}
        </div>

        {/* ============================================================================================== */}
        {/* VIEW 1: MONOCHROME LUXURY EDITORIAL SHOWCASE (When activeCategory === 'all')                   */}
        {/* ============================================================================================== */}
        {activeCategory === 'all' && (
          <div className="space-y-12 font-sans">


            {/* Asymmetric Editorial Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((cat, idx) => {
                const bgImg = cat.image || CATEGORY_IMAGES[cat.id] || CATEGORY_IMAGES['granites'];
                const isHero = idx === 0; // First collection item gets Hero treatment
                const formattedIndex = String(idx + 1).padStart(2, '0');

                return (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    whileHover={{ y: -6 }}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`relative rounded-3xl overflow-hidden group cursor-pointer border border-gray-200/80 hover:border-black transition-all duration-500 shadow-md hover:shadow-2xl bg-black flex flex-col justify-between ${isHero
                      ? 'md:col-span-2 lg:col-span-2 min-h-[440px] sm:min-h-[480px] p-8 sm:p-12'
                      : 'min-h-[380px] sm:min-h-[420px] p-8'
                      }`}
                  >
                    {/* Background Stone Image with Slow Parallax Zoom */}
                    <img
                      src={bgImg}
                      alt={cat.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-75 group-hover:scale-105 transition-all duration-1000 ease-out"
                    />

                    {/* Dark Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent group-hover:from-black group-hover:via-black/70 transition-colors duration-700" />

                    {/* Top Header Row: Index & Subtitle */}
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold tracking-widest text-white bg-black/80 px-3.5 py-1 rounded-full border border-white/20 backdrop-blur-md">
                          {formattedIndex}
                        </span>
                        <span className="text-[11px] uppercase tracking-widest font-extrabold text-accent-gold hidden sm:inline">
                          {cat.subtitle || 'Architectural Stone'}
                        </span>
                      </div>

                      <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-md group-hover:bg-white group-hover:text-black transition-all duration-300">
                        <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
                      </div>
                    </div>

                    {/* Bottom Category Details */}
                    <div className="relative z-10 space-y-3 pt-12">
                      <h3 className={`font-serif font-bold text-white group-hover:text-accent-gold transition-colors ${isHero ? 'text-3xl sm:text-5xl' : 'text-2xl sm:text-3xl'
                        }`}>
                        {cat.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-gray-300 font-sans line-clamp-2 leading-relaxed max-w-xl">
                        {cat.description}
                      </p>

                      <div className="pt-4 flex items-center justify-between border-t border-white/15 text-xs text-gray-300 font-semibold tracking-wider uppercase">
                        <span>Explore {cat.title} Collection</span>
                        <span className="group-hover:translate-x-1 transition-transform">↗</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================================================================================== */}
        {/* VIEW 2: DEDICATED CATEGORY PRODUCTS VIEW (COMPACT & MINIMAL LUXURY)                 */}
        {/* ==================================================================================== */}
        {activeCategory !== 'all' && (
          <div className="space-y-8">
            {/* Category Page Title */}
            <div className="border-b border-gray-200 pb-4 flex justify-between items-end">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-accent-gold block">
                  Category Collection: {currentCategoryObj?.title || activeCategory}
                </span>
                <h2 className="font-serif text-3xl font-bold text-gray-900 mt-1">
                  {currentCategoryObj?.subtitle || `${currentCategoryObj?.title} Selection`}
                </h2>
              </div>
              <span className="text-xs text-gray-500 hidden sm:inline font-medium">
                {products.length} Products Available
              </span>
            </div>

            {/* DYNAMIC SUB-CATEGORY FILTER PILLS */}
            {dynamicSubCategories.length > 0 && (
              <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-gray-100 border border-gray-200 text-xs font-semibold text-gray-600 shrink-0">
                  <Filter className="w-3.5 h-3.5 text-accent-gold" /> Sub-Types:
                </div>

                <button
                  onClick={() => setActiveSubCategory('all')}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 whitespace-nowrap cursor-pointer ${activeSubCategory === 'all'
                    ? 'bg-black text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  All {currentCategoryObj?.title || 'Items'}
                </button>

                {dynamicSubCategories.map((subName) => {
                  const isSubActive = activeSubCategory === subName;
                  return (
                    <button
                      key={subName}
                      onClick={() => setActiveSubCategory(subName)}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 whitespace-nowrap cursor-pointer ${isSubActive
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

            {/* COMPACT & MINIMAL PRODUCT CARDS GRID */}
            {loading ? (
              <div className="py-20 text-center text-sm text-gray-500 font-sans">Loading category products...</div>
            ) : products.length === 0 ? (
              <div className="py-20 text-center text-sm text-gray-500 font-sans">No products listed under this option.</div>
            ) : (
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence>
                  {products.map((product) => {
                    return (
                      <motion.div
                        key={product.id || product._id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setSelectedProduct(product)}
                        className="bg-white rounded-2xl overflow-hidden flex flex-col group border border-gray-200 hover:border-black transition-all shadow-sm hover:shadow-lg cursor-pointer"
                      >
                        {/* Compact Image Container */}
                        <div className="relative h-48 overflow-hidden bg-gray-100 shrink-0">
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40" />

                          {/* Sub-Category Pill */}
                          {product.subCategory && (
                            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider bg-black/80 text-white border border-white/20 backdrop-blur-sm">
                              {product.subCategory}
                            </div>
                          )}

                          {/* In Stock Dot Badge */}
                          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-green-600/90 text-white backdrop-blur-sm flex items-center gap-1">
                            <Check className="w-2.5 h-2.5" />
                            <span>In Stock</span>
                          </div>
                        </div>

                        {/* Minimal Card Body (Image, Name, Subtype/Category, Price) */}
                        <div className="p-5 flex flex-col flex-grow justify-between space-y-4 font-sans">
                          <div className="space-y-1.5">
                            <span className="text-[10px] uppercase tracking-widest text-accent-gold font-bold block truncate">
                              {product.subCategory || product.category}
                            </span>
                            <h3 className="font-serif text-lg font-bold text-gray-900 group-hover:text-accent-gold transition-colors line-clamp-1">
                              {product.title}
                            </h3>
                          </div>

                          {/* Price & Action Row */}
                          <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                            <div>
                              {product.offerPrice ? (
                                <div className="font-mono text-sm font-bold text-gray-900">
                                  ₹{product.offerPrice} <span className="line-through text-[11px] text-gray-400 font-normal">₹{product.price}</span>
                                  <span className="text-[10px] text-gray-500 font-normal"> /{product.unit || 'sq.ft'}</span>
                                </div>
                              ) : (
                                <div className="font-mono text-sm font-bold text-gray-900">
                                  ₹{product.price || 'Market Rate'}
                                  <span className="text-[10px] text-gray-500 font-normal"> /{product.unit || 'sq.ft'}</span>
                                </div>
                              )}
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedProduct(product);
                              }}
                              className="px-3.5 py-2 bg-black text-white font-bold text-[11px] uppercase tracking-wider rounded-xl hover:bg-gray-800 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-sm"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View Details</span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* FULL PRODUCT DETAIL SHEET MODAL */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white max-w-3xl w-full rounded-3xl overflow-hidden shadow-2xl relative max-h-[90vh] overflow-y-auto border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-gray-900 hover:text-black cursor-pointer border border-gray-200"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative h-72">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                  <div>
                    <span className="text-xs uppercase tracking-widest text-accent-gold font-bold">
                      {selectedProduct.subtitle || selectedProduct.subCategory}
                    </span>
                    <h2 className="font-serif text-3xl font-bold text-white">{selectedProduct.title}</h2>
                  </div>

                  <div className="bg-black/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-right">
                    <span className="text-[10px] text-gray-300 uppercase block font-semibold">Offer Price</span>
                    <span className="font-mono text-xl font-bold text-accent-gold">
                      ₹{selectedProduct.offerPrice || selectedProduct.price} <span className="text-xs font-normal text-white">/{selectedProduct.unit || 'sq.ft'}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6 font-sans">
                <p className="text-sm text-gray-700 leading-relaxed font-sans">
                  {selectedProduct.description}
                </p>

                {/* Key Product Attributes */}
                {selectedProduct.features && selectedProduct.features.length > 0 && (
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-accent-gold font-bold mb-3">Key Product Attributes</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedProduct.features.map((feat) => (
                        <div key={feat} className="flex items-center gap-2 text-xs font-semibold text-gray-800 bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                          <CheckCircle2 className="w-4 h-4 text-accent-gold shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Technical Specifications */}
                {selectedProduct.specs && Object.keys(selectedProduct.specs).length > 0 && (
                  <div className="p-5 rounded-2xl border border-gray-200 bg-gray-50 space-y-3 font-sans">
                    <h4 className="text-xs uppercase tracking-widest text-gray-900 font-bold">Technical Specifications</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                      {Object.entries(selectedProduct.specs).map(([k, v]) => (
                        <div key={k} className="space-y-0.5">
                          <span className="block text-gray-500 capitalize text-[11px]">{k}</span>
                          <span className="font-bold text-gray-900 block">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-gray-200">
                  <MagneticButton
                    variant="primary"
                    size="md"
                    className="w-full sm:w-auto"
                    onClick={() => handleInquiry(selectedProduct.title)}
                  >
                    Request Quote for {selectedProduct.title}
                  </MagneticButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
