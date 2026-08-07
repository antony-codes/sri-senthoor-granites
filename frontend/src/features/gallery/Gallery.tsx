import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { SectionHeader } from '@/components/common/SectionHeader';

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
    subtitle: 'High Gloss Glazed Tile Installation',
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
    subtitle: 'Antibacterial Sanitary Suite',
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

  const filteredItems = filter === 'all'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === filter);

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
    <section id="gallery" className="py-24 sm:py-32 relative bg-white text-gray-900 transition-colors font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          badge="Realized Architecture"
          title="Curated Showcase of Installed"
          highlightTitle="Stone Elegance"
          subtitle="Explore completed residential villas, commercial complexes, and luxury bath suites supplied by Sri Senthoor Granites."
        />

        {/* Filter Pills */}
        <div className="flex items-center justify-center gap-3 overflow-x-auto pb-4 mb-12 no-scrollbar">
          {['all', 'granites', 'vitrified-tiles', 'kadappa', 'sanitary-wares', 'bath-fittings'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 whitespace-nowrap capitalize cursor-pointer ${
                filter === cat
                  ? 'bg-black text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-black'
              }`}
            >
              {cat.replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Uniform Symmetrical Gallery Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <AnimatePresence>
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="relative rounded-3xl overflow-hidden group cursor-pointer border border-gray-200 hover:border-black transition-all duration-500 shadow-sm hover:shadow-xl bg-black h-80"
                onClick={() => openLightbox(index)}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                {/* Top Action Icon */}
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60 border border-white/20 backdrop-blur-md">
                  <Maximize2 className="w-4 h-4" />
                </div>

                {/* Bottom Overlay Label */}
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-accent-gold font-bold block">
                    {item.subtitle}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-white group-hover:text-accent-gold transition-colors">{item.title}</h3>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox Viewer Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && filteredItems[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full flex items-center justify-center text-white hover:text-accent-gold bg-black/60 border border-white/20 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Prev Image */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-6 z-10 w-12 h-12 rounded-full flex items-center justify-center text-white hover:text-accent-gold bg-black/60 border border-white/20 cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Image */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-6 z-10 w-12 h-12 rounded-full flex items-center justify-center text-white hover:text-accent-gold bg-black/60 border border-white/20 cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Fullscreen Image Card */}
            <div
              className="relative max-w-4xl max-h-[85vh] w-full rounded-3xl overflow-hidden shadow-2xl bg-black border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={filteredItems[lightboxIndex].image}
                alt={filteredItems[lightboxIndex].title}
                className="w-full h-full max-h-[75vh] object-contain mx-auto"
              />
              <div className="p-6 bg-black/90 border-t border-white/10 text-white text-center">
                <span className="text-xs uppercase tracking-widest text-accent-gold font-bold block mb-1">
                  {filteredItems[lightboxIndex].subtitle}
                </span>
                <h3 className="font-serif text-2xl font-bold">{filteredItems[lightboxIndex].title}</h3>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
