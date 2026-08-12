import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { MapPin, Navigation, Phone, Clock, ArrowUpRight, Send } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa6';
import { COMPANY_INFO } from '@/constants/company';

// Minimal LottieFiles "Loading 40 | Paperplane" Animation Integration
const ExactLottieFilesPaperplane: React.FC = () => {
  return (
    <div className="relative w-full h-[150px] sm:h-[170px] flex items-center justify-center overflow-hidden pointer-events-none">
      <iframe
        src="https://embed.lottiefiles.com/animation/9844"
        title="Loading 40 | Paperplane Lottie Animation"
        className="w-[220px] h-[220px] sm:w-[240px] sm:h-[240px] border-0 pointer-events-none filter drop-shadow-xs scale-90 sm:scale-95"
        loading="eager"
      />
    </div>
  );
};

export const GraniteLocationExperience: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Smooth scroll tracking for UI reveal
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 85%', 'end 85%'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 45,
    damping: 28,
    mass: 0.8,
    restDelta: 0.0001,
  });

  // Info Card Reveal Transforms
  const infoOpacity = useTransform(smoothProgress, [0.4, 0.75], [0, 1]);
  const infoY = useTransform(smoothProgress, [0.4, 0.75], [20, 0]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100/90 text-slate-900 border border-slate-200/90 shadow-xl flex flex-col justify-between p-6 sm:p-7"
    >
      {/* Soft Ambient Radial Backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/5 via-transparent to-transparent pointer-events-none" />

      {/* Floating Top Bar: Live Status & Location Badge */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-slate-200 shadow-2xs backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-700 font-sans">
            Live Showroom
          </span>
        </div>

        <div className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-[10px] uppercase font-extrabold tracking-widest shadow-2xs flex items-center gap-1.5 font-sans">
          <Send className="w-3 h-3 text-indigo-600" />
          <span>Trichy HQ</span>
        </div>
      </div>

      {/* Central LottieFiles Paper Plane Animation */}
      <div className="relative z-10 my-auto flex items-center justify-center pointer-events-auto py-1">
        <ExactLottieFilesPaperplane />
      </div>

      {/* Showroom Info Details (Direct Content Surface) */}
      <motion.div
        style={{
          opacity: infoOpacity,
          y: infoY,
        }}
        className="relative z-20 flex flex-col space-y-4 pt-4 border-t border-slate-200/80"
      >
        {/* Level 1 & Level 2: Eyebrow Tag & Main Title */}
        <div className="space-y-1">
          <span className="text-[11px] uppercase tracking-[0.25em] text-indigo-600 font-extrabold flex items-center gap-1.5 font-sans">
            <MapPin className="w-3.5 h-3.5 text-indigo-600" /> VISIT US
          </span>
          <h3 className="font-sans text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Come See It In Person.
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed pt-0.5">
            Our showroom in Trichy brings together carefully selected materials for your next space.
          </p>
        </div>

        {/* Level 3 & Level 4: Structured Address Block */}
        <div className="pt-2 border-t border-slate-200/80 space-y-0.5">
          <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block font-sans mb-1">
            Showroom Address
          </span>
          <p className="text-xs sm:text-sm font-bold text-slate-900 font-sans leading-snug">
            No. 261/1B2, Ariyamangalam, Palpannai
          </p>
          <p className="text-xs text-slate-600 font-medium font-sans">
            Thanjavur Bypass, Trichy – 620010
          </p>
        </div>

        {/* Level 5: Action Buttons Row with Navigation, Call & WhatsApp Icons */}
        <div className="pt-1 flex flex-wrap items-center gap-2.5">
          <a
            href={COMPANY_INFO.address.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-w-[140px] px-5 py-3 bg-black text-white font-extrabold text-xs uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer group"
          >
            <Navigation className="w-3.5 h-3.5 text-white group-hover:rotate-45 transition-transform" />
            <span>GET DIRECTIONS</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-white" />
          </a>

          <a
            href={`tel:${COMPANY_INFO.rawPhones[0]}`}
            className="px-4 py-3 bg-white text-slate-900 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-slate-100 transition-all flex items-center justify-center gap-2 border border-slate-200 shadow-2xs shrink-0"
          >
            <Phone className="w-3.5 h-3.5 text-black" />
            <span>CALL</span>
          </a>

          <a
            href={`https://wa.me/91${COMPANY_INFO.rawPhones[0]}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-3 bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-2xs shrink-0"
          >
            <FaWhatsapp className="w-3.5 h-3.5 text-white" />
            <span>WHATSAPP</span>
          </a>
        </div>

        {/* Level 6: Showroom Specs Footer Row Baseline */}
        <div className="pt-3 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] sm:text-xs font-semibold text-slate-600 font-sans">
          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href={`tel:${COMPANY_INFO.rawPhones[0]}`}
              className="flex items-center gap-1.5 hover:text-slate-900 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-slate-900 shrink-0" />
              <span>+91 72006 29846</span>
            </a>
            <span className="text-slate-400">·</span>
            <a
              href={`https://wa.me/91${COMPANY_INFO.rawPhones[1]}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-emerald-700 transition-colors"
            >
              <FaWhatsapp className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>+91 67422 7978</span>
            </a>
          </div>

          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-900 shrink-0" />
            <span>Mon – Sat 9:00 AM – 8:30 PM · Sun 10:00 AM – 5:00 PM</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
