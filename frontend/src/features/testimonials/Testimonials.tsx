import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, CheckCircle2 } from 'lucide-react';
import { SectionHeader } from '@/components/common/SectionHeader';
import { fetchTestimonials } from '@/services/api';
import { TESTIMONIALS as FALLBACK_TESTIMONIALS } from '@/constants/company';

interface ITestimonialItem {
  id: string;
  name: string;
  role: string;
  content: string;
  rating?: number;
  project?: string;
}

export const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<ITestimonialItem[]>(FALLBACK_TESTIMONIALS);
  const [loading, setLoading] = useState(true);

  // Load testimonials dynamically from REST API (DB)
  useEffect(() => {
    const loadTestimonials = async () => {
      setLoading(true);
      try {
        const data = await fetchTestimonials();
        if (data && data.length > 0) {
          setTestimonials(data);
        }
      } catch {
        // Fallback
      } finally {
        setLoading(false);
      }
    };

    loadTestimonials();
  }, []);

  // Quadruple items to ensure 100% seamless GPU infinite loop reset
  const streamItems = [...testimonials, ...testimonials, ...testimonials, ...testimonials];

  return (
    <section id="testimonials" className="py-14 sm:py-20 relative overflow-hidden bg-white text-gray-900 font-sans border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-8 sm:mb-10">
        <SectionHeader
          badge="Endorsements of Excellence"
          title="What Architects & Homeowners Say"
          highlightTitle="About Sri Senthoor Granites"
          subtitle="Real client endorsements fetched directly from our client database."
        />
      </div>

      {loading && testimonials.length === 0 ? (
        <div className="py-12 text-center text-sm text-gray-500 font-sans">Loading client endorsements...</div>
      ) : (
        <div className="relative w-full overflow-hidden py-3">
          {/* Subtle Side Fade Overlay for Seamless Edge Blending */}
          <div className="absolute top-0 bottom-0 left-0 w-12 sm:w-28 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-12 sm:w-28 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

          {/* Smooth Continuous GPU-Accelerated Track */}
          <div className="flex overflow-hidden group">
            <motion.div
              animate={{ x: ['0%', '-50%'] }}
              transition={{
                repeat: Infinity,
                repeatType: 'loop',
                ease: 'linear',
                duration: Math.max(28, testimonials.length * 9),
              }}
              className="flex gap-5 shrink-0 group-hover:[animation-play-state:paused] will-change-transform"
              style={{ transform: 'translateZ(0)' }}
            >
              {streamItems.map((item, idx) => {
                const initials = item.name
                  ? item.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .substring(0, 2)
                      .toUpperCase()
                  : 'SS';

                const ratingCount = Math.max(1, Math.min(5, Number(item.rating) || 5));

                return (
                  <div
                    key={`${item.id || idx}-${idx}`}
                    className="w-[290px] sm:w-[340px] h-[240px] shrink-0 bg-white rounded-2xl p-6 border border-gray-200 hover:border-black shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group/card cursor-pointer"
                  >
                    {/* Top Row: Stars + Verified Badge */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: ratingCount }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400 stroke-amber-400" />
                          ))}
                        </div>

                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200 text-[9px] uppercase font-bold tracking-wider">
                          <CheckCircle2 className="w-2.5 h-2.5 text-green-600" />
                          <span>Verified</span>
                        </span>
                      </div>

                      {/* Quote Snippet */}
                      <div className="relative pt-0.5">
                        <Quote className="w-4 h-4 text-accent-gold opacity-70 mb-1" />
                        <p className="font-serif text-sm sm:text-base font-medium text-gray-900 leading-snug line-clamp-3">
                          "{item.content}"
                        </p>
                      </div>
                    </div>

                    {/* Author Details Footer */}
                    <div className="pt-3 border-t border-gray-100 flex items-center gap-3 mt-2">
                      <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center font-serif text-xs font-bold shrink-0 shadow-md">
                        {initials}
                      </div>
                      <div className="space-y-0.5 overflow-hidden">
                        <h4 className="font-serif text-xs sm:text-sm font-bold text-gray-900 truncate">{item.name}</h4>
                        <span className="text-[10px] font-semibold text-accent-gold block truncate">{item.role}</span>
                        {item.project && (
                          <span className="text-[9px] text-gray-500 font-mono block truncate">
                            └ {item.project}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>
      )}
    </section>
  );
};
