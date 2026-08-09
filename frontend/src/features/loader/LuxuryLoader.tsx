import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface LuxuryLoaderProps {
  onComplete: () => void;
}

export const LuxuryLoader: React.FC<LuxuryLoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 1500; // ms
    const interval = 20; // ms update frequency
    const steps = duration / interval;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 300);
          return 100;
        }
        return Math.floor(next);
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  // Dashoffset calculation for SVG circle loader (r=45 -> 2*PI*45 = ~283)
  const strokeDasharray = 283;
  const dashOffset = strokeDasharray - (strokeDasharray * progress) / 100;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black text-white"
    >
      {/* Subtle Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div className="flex flex-col items-center gap-8 relative z-10">
        {/* Animated Circular Ring Loader */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background Ring */}
            <circle
              cx="50"
              cy="50"
              r="45"
              className="text-gray-800"
              strokeWidth="2"
              stroke="currentColor"
              fill="transparent"
            />
            {/* Progress Arc */}
            <circle
              cx="50"
              cy="50"
              r="45"
              className="text-white transition-all duration-300 ease-out"
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
            <span className="font-mono text-xs text-gray-300 font-light tracking-widest mt-0.5">
              {progress}%
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-1">
          <h2 className="font-serif text-lg sm:text-xl font-bold uppercase tracking-widest text-white">
            Sri Senthoor <span className="font-light italic text-gray-400">Granites</span>
          </h2>
          <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-semibold block">
            Architectural Stone Gallery
          </span>
        </div>
      </div>
    </motion.div>
  );
};
