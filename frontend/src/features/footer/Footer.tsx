import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUp, Phone, MapPin, Clock, Award, Square, Lock } from 'lucide-react';
import { COMPANY_INFO } from '@/constants/company';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.footer
      initial={{ opacity: 0, y: 30, rotateX: 4 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative bg-gray-50 text-gray-800 border-t border-gray-200 pt-12 pb-8 overflow-hidden font-sans perspective-1000 transform-gpu"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-10 border-b border-gray-200">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center gap-2">
              <Square className="w-4 h-4 fill-current text-black stroke-none" />
              <span className="font-sans text-lg font-bold tracking-tight text-black">
                Sri Senthoor Granites
              </span>
            </div>

            <p className="text-xs text-gray-600 font-sans leading-relaxed">
              "{COMPANY_INFO.slogan}" — Premium quarry granites, vitrified porcelain slabs, Kadappa stone, and bath fittings in Trichy, Tamil Nadu.
            </p>

            <div className="pt-1 flex items-center gap-1.5 text-[11px] text-black font-semibold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" />
              <span>Est. {COMPANY_INFO.established}</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-sans text-xs font-bold text-gray-900 uppercase tracking-wider">Collections</h4>
            <ul className="space-y-1.5 text-xs text-gray-600">
              <li><a href="#products" className="hover:text-black transition-colors">Quarry Granites</a></li>
              <li><a href="#products" className="hover:text-black transition-colors">Vitrified Slabs & Tiles</a></li>
              <li><a href="#products" className="hover:text-black transition-colors">Cuddapah Kadappa Stone</a></li>
              <li><a href="#products" className="hover:text-black transition-colors">Ceramic Sanitary Wares</a></li>
              <li><a href="#products" className="hover:text-black transition-colors">Luxury Bath Fittings</a></li>
            </ul>
          </div>

          {/* Col 3: Contact & Location with Black & White LottieFiles Paperplane Animation */}
          <div className="lg:col-span-5 space-y-3 relative">
            <h4 className="font-sans text-xs font-bold text-gray-900 uppercase tracking-wider">
              Showroom Headquarters
            </h4>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              {/* Showroom Address List */}
              <ul className="space-y-2 text-xs text-gray-600 flex-1">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-3.5 h-3.5 text-black shrink-0 mt-0.5" />
                  <span>{COMPANY_INFO.address.full}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-3.5 h-3.5 text-black shrink-0" />
                  <div className="flex gap-2 font-semibold text-gray-800">
                    <a href={`tel:${COMPANY_INFO.rawPhones[1]}`} className="hover:text-black transition-colors">
                      +91 {COMPANY_INFO.rawPhones[1]}
                    </a>
                    <span>/</span>
                    <a href={`tel:${COMPANY_INFO.rawPhones[0]}`} className="hover:text-black transition-colors">
                      +91 {COMPANY_INFO.rawPhones[0]}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <Clock className="w-3.5 h-3.5 text-black shrink-0 mt-0.5" />
                  <span>{COMPANY_INFO.workingHours}</span>
                </li>
              </ul>

              {/* Black and White Theme LottieFiles Paperplane Animation */}
              <div className="w-[140px] h-[95px] overflow-hidden bg-transparent shrink-0 flex items-center justify-center pointer-events-none">
                <iframe
                  src="https://embed.lottiefiles.com/animation/9844"
                  title="Loading 40 | Paperplane Lottie Animation"
                  className="w-[180px] h-[180px] border-0 pointer-events-none bg-transparent filter grayscale contrast-125 brightness-95 opacity-90"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 font-sans">
          <p>© {new Date().getFullYear()} {COMPANY_INFO.name}. All Rights Reserved.</p>
          
          <Link
            to="/login"
            className="tracking-wider uppercase text-[10px] text-gray-400 hover:text-black transition-colors flex items-center gap-1 font-semibold"
          >
            <Lock className="w-3 h-3 text-black" /> Admin Portal
          </Link>

          <button
            onClick={scrollToTop}
            className="px-3.5 py-1.5 bg-white border border-gray-200 hover:border-black text-gray-800 font-semibold text-[11px] rounded-xl transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <span>Back To Top</span>
            <ArrowUp className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.footer>
  );
};
