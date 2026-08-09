import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import { COMPANY_INFO } from '@/constants/company';

const HERO_SLIDES = [
  {
    // badge: 'IMPORTED MARBLE SLABS · STATUARIO IMPERIAL ITALIAN MARBLE',
    titleLine1: 'Sri Senthoor',
    titleLine2: 'Granites',
    leftSpec: 'SURFACE INTELLIGENCE · CLASS A CERTIFIED',
    rightSpec: `ZERO FLAW · ZERO COMPROMISE · EST. ${COMPANY_INFO.established}`,
    bgImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80',
  },
  {
    // badge: 'PREMIUM GANGSAW GRANITE SLABS · DIRECT QUARRY SELECTION',
    titleLine1: 'Exclusive',
    titleLine2: 'Granites',
    leftSpec: 'MIRROR POLISHED · SCRATCH & HEAT RESISTANT',
    rightSpec: 'BESPOKE CUTS · ALL INDIA SHIPPING',
    bgImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=80',
  },
  {
    // badge: 'ULTRA-LARGE FORMAT PORCELAIN · VITRIFIED SLABS',
    titleLine1: 'Vitrified',
    titleLine2: 'Tiles',
    leftSpec: 'SEAMLESS RECTIFIED EDGES · ZERO ABSORPTION',
    rightSpec: 'HIGH FOOT TRAFFIC ENDURANCE',
    bgImage: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=2000&q=80',
  },
  {
    // badge: 'LUXURY BATHWARE & SANITARY FITTINGS',
    titleLine1: 'Bath &',
    titleLine2: 'Sanitary',
    leftSpec: 'PVD FINISHES & MATTE BLACK FINISHES',
    rightSpec: 'THERMOSTATIC FLOW TECHNOLOGY',
    bgImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=2000&q=80',
  },
];

export const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToProducts = () => {
    const el = document.getElementById('products');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const slide = HERO_SLIDES[currentSlide];

  return (
    <section
      id="hero"
      className="relative pt-24 pb-16 sm:pb-24 bg-white text-black overflow-hidden"
    >
      {/* Floating Micro Particle background field */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-12 left-1/4 w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-1 h-1 rounded-full bg-black animate-ping" />
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 rounded-full bg-black" />
        <div className="absolute top-2/3 right-1/3 w-2 h-2 rounded-full bg-black opacity-40" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col gap-12">
        {/* 1. Large Central Hero Banner Showcase Card (Exact Original Composition) */}
        <div className="relative w-full rounded-[28px] sm:rounded-[36px] overflow-hidden shadow-2xl bg-black min-h-[460px] sm:min-h-[540px] md:min-h-[600px] flex flex-col justify-between p-6 sm:p-10 text-white">
          {/* Animated Background Image Slide */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.7 }}
              className="absolute inset-0 z-0"
            >
              <img
                src={slide.bgImage}
                alt={slide.titleLine1}
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60" />
            </motion.div>
          </AnimatePresence>

          {/* Top Floating Badge */}
          {/* <div className="relative z-10 flex justify-center">
            <motion.div
              key={`badge-${currentSlide}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-white shadow-lg"
            >
              <Sparkles className="w-3 h-3 text-white" />
              <span>{slide.badge}</span>
            </motion.div>
          </div> */}

          {/* Center Giant Display Typography */}
          <div className="relative z-10 flex flex-col items-center justify-center my-auto text-center py-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={`title-${currentSlide}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center"
              >
                <h1 className="font-sans text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight text-white leading-none">
                  {slide.titleLine1}
                </h1>
                <h1 className="font-sans text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight text-white leading-none mt-1 sm:mt-2">
                  {slide.titleLine2}
                </h1>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Card Specifications & Slide Pagination Controls */}
          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] sm:text-xs tracking-[0.2em] font-semibold text-gray-300 uppercase">
              <span className="flex items-center gap-1.5">
                <span className="text-white">✦</span> {slide.leftSpec}
              </span>
              <span className="hidden sm:flex items-center gap-1.5">
                {slide.rightSpec} <span className="text-white">✦</span>
              </span>
            </div>

            {/* Slider Navigation Dots & Arrows - Floating Bottom Center */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                onClick={prevSlide}
                aria-label="Previous Slide"
                className="w-8 h-8 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Dots Pagination */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-white/15">
                {HERO_SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`transition-all duration-300 rounded-full cursor-pointer ${
                      currentSlide === idx
                        ? 'w-6 h-2 bg-white'
                        : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                aria-label="Next Slide"
                className="w-8 h-8 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 2. Sub-Hero 2-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-4">
          {/* Left Column Text Copy */}
          <div className="md:col-span-8">
            <p className="text-lg sm:text-xl md:text-2xl text-gray-700 font-sans font-normal leading-relaxed max-w-3xl">
              From natural gangsaw granites to Italian Statuario marble, Vitrified tiles to luxury sanitaryware – we're your complete architectural stone partner in Trichy.
            </p>
          </div>

          {/* Right Column Stacked Buttons */}
          <div className="md:col-span-4 flex flex-col items-stretch sm:items-end gap-3">
            {/* Top Solid Button */}
            <button
              onClick={scrollToContact}
              className="w-full sm:w-64 px-6 py-4 bg-black text-white font-bold text-xs uppercase tracking-widest rounded-md hover:bg-gray-800 transition-all flex items-center justify-center gap-3 shadow-md cursor-pointer"
            >
              <span>REQUEST A QUOTE</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Bottom Outline Button */}
            <button
              onClick={scrollToProducts}
              className="w-full sm:w-64 px-6 py-4 bg-white border border-gray-300 text-gray-900 font-bold text-xs uppercase tracking-widest rounded-md hover:border-black transition-all flex items-center justify-center gap-3 cursor-pointer"
            >
              <span>EXPLORE PRODUCTS</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
