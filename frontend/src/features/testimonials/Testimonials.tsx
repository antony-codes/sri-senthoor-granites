import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { SectionHeader } from '@/components/common/SectionHeader';
import { GlassCard } from '@/components/common/GlassCard';
import { TESTIMONIALS } from '@/constants/company';

export const Testimonials: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  return (
    <section id="testimonials" className="py-24 sm:py-32 relative overflow-hidden bg-gray-50 text-gray-900 transition-colors font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          badge="Endorsements of Excellence"
          title="What Architects & Homeowners Say"
          highlightTitle="About Our Craft"
          subtitle="Honest testimonials from our esteemed clientele who trusted Sri Senthoor Granites for their private residences and commercial developments."
        />

        {/* Featured Testimonial Slider */}
        <div className="max-w-4xl mx-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={TESTIMONIALS[activeIdx].id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
            >
              <GlassCard hoverEffect={false} className="p-8 sm:p-12 relative border-accent-gold/30">
                {/* Quote Icon */}
                <Quote className="w-12 h-12 text-accent-gold/20 absolute top-8 left-8 pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center text-center">
                  {/* Star Rating */}
                  <div className="flex items-center gap-1.5 mb-6 text-accent-gold">
                    {[...Array(TESTIMONIALS[activeIdx].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-accent-gold" />
                    ))}
                  </div>

                  {/* Review Text */}
                  <blockquote className="font-serif text-xl sm:text-2xl text-gray-900 italic leading-relaxed max-w-2xl">
                    "{TESTIMONIALS[activeIdx].content}"
                  </blockquote>

                  {/* Author Details */}
                  <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col items-center">
                    <span className="font-serif text-lg font-bold text-gray-900">
                      {TESTIMONIALS[activeIdx].name}
                    </span>
                    <span className="text-xs text-accent-gold font-medium mt-0.5">
                      {TESTIMONIALS[activeIdx].role}
                    </span>
                    <span className="text-[11px] text-gray-500 mt-1 uppercase tracking-widest font-mono">
                      Project: {TESTIMONIALS[activeIdx].project}
                    </span>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </AnimatePresence>

          {/* Slider Navigation Buttons */}
          <div className="flex items-center justify-between mt-8">
            <div className="flex items-center gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIdx(i)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    activeIdx === i ? 'w-8 bg-black' : 'w-2 bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handlePrev}
                className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-700 hover:text-black transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-700 hover:text-black transition-colors cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
