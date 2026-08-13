import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Square, ArrowLeft, LayoutDashboard, Compass, Search } from 'lucide-react';
import { COMPANY_INFO } from '@/constants/company';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8 bg-gray-50 text-gray-900 font-sans selection:bg-black selection:text-white relative overflow-hidden">
      {/* Background Subtle Granite Texture & Gradient Mesh Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-200/60 via-gray-50 to-white pointer-events-none" />

      {/* Decorative Architectural Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none" />

      {/* Main Glass Card Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-xl w-full bg-white/90 backdrop-blur-md rounded-3xl border border-gray-200 shadow-2xl p-8 sm:p-12 text-center space-y-8"
      >
        {/* Brand Emblem */}
        <div className="flex items-center justify-center gap-2.5">
          <Square className="w-5 h-5 fill-current text-black stroke-none" />
          <span className="font-sans text-xs font-bold tracking-widest text-black uppercase">
            Sri Senthoor Granites
          </span>
        </div>

        {/* Minimal Monochrome Stone Motion Emblem */}
        <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
          {/* Animated Outer Pulse Ring */}
          <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-full bg-gray-100 border border-gray-300"
          />

          {/* Inner Monochromatic Compass Graphic */}
          <div className="w-32 h-32 rounded-full bg-white border border-gray-200 shadow-lg flex flex-col items-center justify-center relative z-10 space-y-1">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center shadow-md"
            >
              <Compass className="w-6 h-6 stroke-[1.75]" />
            </motion.div>
            <span className="font-sans text-2xl font-black text-gray-900 tracking-tighter">404</span>
          </div>

          {/* Floating Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="absolute -bottom-2 px-3 py-1 rounded-full bg-black text-white text-[10px] font-extrabold uppercase tracking-widest shadow-md z-20"
          >
            Page Not Found
          </motion.div>
        </div>

        {/* Text Copy */}
        <div className="space-y-2.5 max-w-md mx-auto">
          <h1 className="font-sans text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
            Lost Your Way?
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-sans leading-relaxed">
            The page you're looking for doesn't exist or may have been moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-3.5 bg-black text-white font-extrabold text-xs uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Home</span>
          </Link>

          <Link
            to="/dashboard"
            className="w-full sm:w-auto px-6 py-3.5 bg-gray-100 text-gray-800 border border-gray-200 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-gray-200 hover:text-black transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <LayoutDashboard className="w-4 h-4 text-black" />
            <span>Go to Dashboard</span>
          </Link>
        </div>

        {/* Footer Slogan */}
        <div className="pt-4 border-t border-gray-100">
          <p className="text-[11px] text-gray-400 font-medium">
            "{COMPANY_INFO.slogan}" — Sri Senthoor Granites
          </p>
        </div>
      </motion.div>
    </div>
  );
};
