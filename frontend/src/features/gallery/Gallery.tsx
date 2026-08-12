import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { SectionHeader } from '@/components/common/SectionHeader';
import { fetchCategories } from '@/services/api';
import { ICategory } from '@/types';

interface GalleryItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  image: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g-1',
    title: 'Imperial Statuario Villa Floor',
    subtitle: 'Glazed Porcelain Installation',
    category: 'vitrified-tiles',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'g-2',
    title: 'Black Galaxy Executive Kitchen',
    subtitle: 'Mirror Polished Granite Countertop',
    category: 'granites',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'g-3',
    title: 'Cuddapah Slate Courtyard Steps',
    subtitle: 'Natural Non-Slip Kadappa Stone',
    category: 'kadappa',
    image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'g-4',
    title: 'PVD Gold Spa Shower Suite',
    subtitle: 'Thermostatic Brass Fittings',
    category: 'bath-fittings',
    image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'g-5',
    title: 'Freestanding Stone Ceramic Basin',
    subtitle: 'Sanitary Suite Installation',
    category: 'sanitary-wares',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'g-6',
    title: 'Tan Brown Reception Desk Cladding',
    subtitle: 'Quarry Grade Granite Slabs',
    category: 'granites',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  },
];

export const Gallery: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeCategories, setActiveCategories] = useState<ICategory[]>([]);

  const sectionRef = useRef<HTMLDivElement>(null);

  // Real-time continuous scroll tracking for Gallery
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 90, damping: 22 });

  // 3D Spatial Deck transforms linked continuously to scrolling
  const oddRotateY = useTransform(smoothProgress, [0, 0.5, 1], [16, 0, -12]);
  const evenRotateY = useTransform(smoothProgress, [0, 0.5, 1], [-16, 0, 12]);
  const galleryScale = useTransform(smoothProgress, [0, 0.5, 1], [0.91, 1, 0.94]);
  const galleryY = useTransform(smoothProgress, [0, 0.5, 1], [55, 0, -35]);

  useEffect(() => {
    fetchCategories().then((cats) => setActiveCategories(cats)).catch(() => { });
  }, []);

  const activeCatIds = new Set(activeCategories.map((c) => c.id));
  const activeGalleryItems = GALLERY_ITEMS.filter((item) => activeCatIds.size === 0 || activeCatIds.has(item.category));

  const filteredItems = filter === 'all'
    ? activeGalleryItems
    : activeGalleryItems.filter((item) => item.category === filter);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
    }
  };

  const prevImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="gallery"
      className="py-12 sm:py-16 relative bg-white text-gray-900 transition-colors font-sans border-t border-gray-100 overflow-hidden perspective-1000"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          title="Architecture"
          highlightTitle="Showcase"
          subtitle="Explore completed residential villas, commercial complexes, and luxury bath suites."
        />

        {/* Filter Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-3 mb-10 no-scrollbar">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              filter === 'all'
                ? 'bg-black text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-black'
            }`}
          >
            All Collections
          </button>
          {activeCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                filter === cat.id
                  ? 'bg-black text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-black'
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>

        {/* Gallery Grid (Real-Time Continuous Scroll-Driven 3D Spatial Deck) */}
        <motion.div
          style={{
            scale: galleryScale,
            y: galleryY,
            transformStyle: 'preserve-3d',
          }}
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transform-gpu"
        >
          <AnimatePresence>
            {filteredItems.map((item, index) => {
              const formattedNum = String(index + 1).padStart(2, '0');
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={item.id}
                  layout
                  style={{
                    rotateY: isEven ? evenRotateY : oddRotateY,
                    transformStyle: 'preserve-3d',
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: (index % 3) * 0.08 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="relative rounded-2xl overflow-hidden group cursor-pointer border border-gray-200 hover:border-black transition-all duration-500 shadow-sm hover:shadow-2xl bg-black h-64 sm:h-72 transform-gpu flex flex-col justify-between p-5"
                  onClick={() => openLightbox(index)}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out opacity-80 group-hover:opacity-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />

                  {/* Top Bar Architectural Spec Badge with 3D Depth */}
                  <div style={{ transform: 'translateZ(30px)' }} className="relative z-10 flex items-center justify-between">
                    <span className="font-sans text-[10px] font-bold text-white bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/20 shadow-sm">
                      GALLERY {formattedNum}
                    </span>

                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/60 border border-white/20 backdrop-blur-sm group-hover:scale-110">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Bottom Text Spec with 3D Elevation */}
                  <div style={{ transform: 'translateZ(45px)' }} className="relative z-10 text-white space-y-0.5">
                    <span className="text-[10px] uppercase tracking-widest text-gray-300 font-extrabold block">
                      {item.subtitle}
                    </span>
                    <h3 className="font-sans text-lg font-bold text-white leading-snug group-hover:text-gray-100 transition-colors">
                      {item.title}
                    </h3>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && filteredItems[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={closeLightbox}
          >
            <div className="relative max-w-4xl w-full flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={closeLightbox}
                className="absolute -top-10 right-0 text-white hover:text-gray-300 p-2 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              <img
                src={filteredItems[lightboxIndex].image}
                alt={filteredItems[lightboxIndex].title}
                className="max-h-[75vh] w-auto object-contain rounded-2xl shadow-2xl border border-white/10"
              />

              <div className="mt-3 text-center text-white space-y-0.5 font-sans">
                <h3 className="font-sans text-xl font-bold">{filteredItems[lightboxIndex].title}</h3>
                <p className="text-xs text-gray-300">{filteredItems[lightboxIndex].subtitle}</p>
              </div>

              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
