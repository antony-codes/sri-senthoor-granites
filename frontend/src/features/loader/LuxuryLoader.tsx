import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { COMPANY_INFO } from '@/constants/company';

interface LuxuryLoaderProps {
  onComplete: () => void;
}

export const LuxuryLoader: React.FC<LuxuryLoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Lock body scroll while loader is active
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 1200; // ms total load time

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          if (onCompleteRef.current) {
            onCompleteRef.current();
          }
        }, 150);
      }
    }, 16); // ~60fps smooth tick

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black text-white selection:bg-none pointer-events-auto"
    >
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.07)_0%,transparent_65%)] pointer-events-none" />

      <div className="flex flex-col items-center gap-6 relative z-10 p-4">
        {/* Brand Title & Subtitle */}
        <div className="text-center space-y-2">
          <h2 className="font-sans text-xl sm:text-2xl font-bold tracking-widest text-white">
            Sri Senthoor Granites
          </h2>
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-gray-400 font-semibold block">
            Architectural Stone Gallery • {COMPANY_INFO.address.city}
          </span>
        </div>

        {/* Bottom Progress Line Bar & Counter */}
        <div className="flex flex-col items-center gap-2 mt-2">
          <div className="w-56 sm:w-64 h-1 bg-gray-800 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-white transition-all duration-75 ease-linear rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="font-sans text-xs text-gray-400 font-semibold tracking-widest">
            {progress}%
          </span>
        </div>
      </div>
    </motion.div>
  );
};
