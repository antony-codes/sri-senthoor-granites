import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface LuxuryLoaderProps {
  onComplete: () => void;
}

export const LuxuryLoader: React.FC<LuxuryLoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Disable scrollbar while loader is active
    document.body.style.overflow = 'hidden';

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            document.body.style.overflow = 'unset';
            onComplete();
          }, 500);
          return 100;
        }
        const diff = Math.floor(Math.random() * 12) + 6;
        return Math.min(prev + diff, 100);
      });
    }, 50);

    return () => {
      document.body.style.overflow = 'unset';
      clearInterval(timer);
    };
  }, [onComplete]);

  const dashOffset = 283 - (283 * progress) / 100;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[100] bg-black text-white flex items-center justify-center overflow-hidden pointer-events-none select-none font-sans"
    >
      {/* Background Subtle Large Outlined Brand Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none whitespace-nowrap overflow-hidden">
        <span className="font-serif text-[18vw] font-black uppercase tracking-[0.2em] text-transparent stroke-white stroke-1">
          SENTHOOR
        </span>
      </div>

      {/* Center Unique Circular Progress Ring & Monogram */}
      <div className="relative flex flex-col items-center justify-center space-y-8 z-10">
        <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center">
          {/* Circular SVG Laser Progress Indicator */}
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
            {/* Track Ring */}
            <circle
              cx="50"
              cy="50"
              r="45"
              className="text-neutral-900"
              strokeWidth="2"
              stroke="currentColor"
              fill="transparent"
            />
            {/* Progress Arc */}
            <circle
              cx="50"
              cy="50"
              r="45"
              className="text-accent-gold transition-all duration-300 ease-out"
              strokeWidth="2.5"
              strokeDasharray="283"
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
            />
          </svg>

          {/* Centered Monogram & Counter */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">SSG</span>
            <span className="font-mono text-xs text-accent-gold font-light tracking-widest mt-0.5">
              {progress}%
            </span>
          </div>
        </div>

        {/* Minimalist Title */}
        <div className="text-center space-y-1">
          <h2 className="font-serif text-lg sm:text-xl font-bold uppercase tracking-widest text-white">
            Sri Senthoor <span className="font-light italic text-accent-gold">Granites</span>
          </h2>
          <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-semibold block">
            Architectural Stone Gallery
          </span>
        </div>
      </div>
    </motion.div>
  );
};
