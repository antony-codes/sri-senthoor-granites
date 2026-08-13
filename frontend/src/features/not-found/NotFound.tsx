import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Square, ArrowLeft, LayoutDashboard, Compass } from 'lucide-react';
import { COMPANY_INFO } from '@/constants/company';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8 bg-gray-50 text-gray-900 font-sans selection:bg-black selection:text-white relative overflow-hidden">
      {/* Background Subtle Granite Texture & Lighting Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-200/50 via-gray-50 to-white pointer-events-none" />

      {/* Decorative Floating Luxury Grid Lines */}
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
          <span className="font-sans text-sm font-bold tracking-tight text-black uppercase">
            Sri Senthoor Granites
          </span>
        </div>

        {/* LottieFiles Monochrome Animation Embed */}
        <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gray-100/80 border border-gray-200/60 shadow-inner flex items-center justify-center overflow-hidden">
            <iframe
              src="https://embed.lottiefiles.com/animation/112656"
              className="w-full h-full border-none filter grayscale contrast-125 brightness-95 opacity-90"
              title="404 Monochrome Motion"
            />
          </div>
          {/* Subtle floating 404 pill badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute -bottom-2 px-3 py-0.5 rounded-full bg-black text-white text-[10px] font-extrabold uppercase tracking-widest shadow-md"
          >
            Error 404
          </motion.div>
        </div>

        {/* Main Text Content */}
        <div className="space-y-3 max-w-md mx-auto">
          <h1 className="font-sans text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
            Page Not Found
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

        {/* Subtle Brand Slogan Footer */}
        <div className="pt-4 border-t border-gray-100">
          <p className="text-[11px] text-gray-400 font-medium">
            "{COMPANY_INFO.slogan}" — Sri Senthoor Granites
          </p>
        </div>
      </motion.div>
    </div>
  );
};
