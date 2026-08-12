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

  const streamItems = [...testimonials, ...testimonials, ...testimonials, ...testimonials];

  return (
    <section id="testimonials" className="py-12 sm:py-16 relative overflow-hidden bg-white text-gray-900 font-sans border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-6 sm:mb-8">
        <SectionHeader
          title="Client"
          highlightTitle="Endorsements"
          subtitle="Feedback from architects, builders, and homeowners across Tamil Nadu."
        />
      </div>

      {loading && testimonials.length === 0 ? (
        <div className="py-10 text-center text-xs text-gray-500 font-sans">Loading client endorsements...</div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 35, scale: 0.95, rotateX: 6 }}
          whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full overflow-hidden py-2 perspective-1000 transform-gpu"
        >
          <div className="absolute top-0 bottom-0 left-0 w-12 sm:w-28 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-12 sm:w-28 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

          <div className="flex overflow-hidden group">
            <motion.div
              animate={{ x: ['0%', '-50%'] }}
              transition={{
                repeat: Infinity,
                repeatType: 'loop',
                ease: 'linear',
                duration: Math.max(28, testimonials.length * 9),
              }}
              className="flex gap-4 shrink-0 group-hover:[animation-play-state:paused] will-change-transform"
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
                    className="w-[270px] sm:w-[310px] h-[200px] shrink-0 bg-white rounded-2xl p-5 border border-gray-200 hover:border-black shadow-sm transition-all duration-300 flex flex-col justify-between group/card cursor-pointer"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: ratingCount }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-black text-black stroke-black" />
                          ))}
                        </div>

                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200 text-[9px] uppercase font-bold tracking-wider">
                          <CheckCircle2 className="w-2.5 h-2.5 text-green-600" />
                          <span>Verified</span>
                        </span>
                      </div>

                      <div className="relative pt-0.5">
                        <Quote className="w-3.5 h-3.5 text-black opacity-40 mb-0.5" />
                        <p className="font-sans text-xs sm:text-sm font-medium text-gray-800 leading-snug line-clamp-3">
                          "{item.content}"
                        </p>
                      </div>
                    </div>

                    <div className="pt-2.5 border-t border-gray-100 flex items-center gap-2.5 mt-1">
                      <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-sans text-[11px] font-bold shrink-0 shadow-sm">
                        {initials}
                      </div>
                      <div className="space-y-0.5 overflow-hidden">
                        <h4 className="font-sans text-xs font-bold text-gray-900 truncate">{item.name}</h4>
                        <span className="text-[10px] font-semibold text-gray-600 block truncate">{item.role}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </motion.div>
      )}
    </section>
  );
};
