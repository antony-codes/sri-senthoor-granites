import React from 'react';
import { ArrowUp, Phone, MapPin, Clock, Award, Square, Lock } from 'lucide-react';
import { COMPANY_INFO } from '@/constants/company';
import { MagneticButton } from '@/components/common/MagneticButton';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-gray-100 text-gray-800 border-t border-gray-200 pt-20 pb-12 overflow-hidden transition-colors">
      {/* Glow highlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-accent-gold/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-gray-200">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <Square className="w-5 h-5 fill-current text-black stroke-none" />
              <span className="font-serif text-xl font-bold tracking-tight text-black">
                SriSenthoor<span className="font-light italic text-gray-600">Granites</span>
              </span>
            </div>

            <p className="text-sm text-gray-600 font-sans leading-relaxed">
              "{COMPANY_INFO.slogan}" — Premium quarry granites, vitrified porcelain slabs, kadappa stone, and designer bath fittings in Trichy, Tamil Nadu.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-accent-gold font-semibold uppercase tracking-wider">
              <Award className="w-4 h-4 text-accent-gold" />
              <span>Est. {COMPANY_INFO.established} • Founder: {COMPANY_INFO.founder}</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-serif text-base font-bold text-gray-900 uppercase tracking-wider">Collections</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#products" className="hover:text-accent-gold transition-colors">Quarry Granites</a></li>
              <li><a href="#products" className="hover:text-accent-gold transition-colors">Vitrified Slabs & Tiles</a></li>
              <li><a href="#products" className="hover:text-accent-gold transition-colors">Cuddapah Kadappa Stone</a></li>
              <li><a href="#products" className="hover:text-accent-gold transition-colors">Ceramic Sanitary Wares</a></li>
              <li><a href="#products" className="hover:text-accent-gold transition-colors">Luxury Bath Fittings</a></li>
            </ul>
          </div>

          {/* Col 3: Contact & Location */}
          <div className="lg:col-span-5 space-y-4">
            <h4 className="font-serif text-base font-bold text-gray-900 uppercase tracking-wider">Showroom Headquarters</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-accent-gold shrink-0 mt-1" />
                <span>{COMPANY_INFO.address.full}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-accent-gold shrink-0" />
                <div className="flex gap-3">
                  <a href={`tel:${COMPANY_INFO.rawPhones[1]}`} className="hover:text-accent-gold transition-colors font-semibold">
                    +91 {COMPANY_INFO.rawPhones[1]}
                  </a>
                  <span>/</span>
                  <a href={`tel:${COMPANY_INFO.rawPhones[0]}`} className="hover:text-accent-gold transition-colors font-semibold">
                    +91 {COMPANY_INFO.rawPhones[0]}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-accent-gold shrink-0 mt-1" />
                <span>{COMPANY_INFO.workingHours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} {COMPANY_INFO.name}. All Rights Reserved.</p>
          
          <a
            href="/dashboard"
            className="tracking-widest uppercase text-[10px] text-gray-400 hover:text-black transition-colors flex items-center gap-1 font-semibold"
          >
            <Lock className="w-3 h-3 text-accent-gold" /> Owner Portal / Dashboard
          </a>

          <MagneticButton
            variant="glass"
            size="sm"
            onClick={scrollToTop}
            className="gap-2"
          >
            <span>Back To Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </MagneticButton>
        </div>
      </div>
    </footer>
  );
};
