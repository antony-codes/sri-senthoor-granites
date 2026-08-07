import React from 'react';
import { motion } from 'framer-motion';
import { Award, Compass, Gem, UserCheck } from 'lucide-react';
import { SectionHeader } from '@/components/common/SectionHeader';
import { COMPANY_INFO, COMPANY_STATS } from '@/constants/company';

export const About: React.FC = () => {
  return (
    <section id="about" className="py-24 sm:py-32 relative overflow-hidden bg-white text-gray-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          badge="Our Heritage & Vision"
          title="Curating Timeless Natural Stone for"
          highlightTitle="Architectural Masterpieces"
          subtitle={`Founded in ${COMPANY_INFO.established} by ${COMPANY_INFO.founder}, Sri Senthoor Granites was built on a singular non-negotiable philosophy: "${COMPANY_INFO.slogan}".`}
        />

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column - Founder Image Card */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative rounded-3xl overflow-hidden border border-gray-200 shadow-xl group bg-black"
            >
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80"
                alt="Sri Senthoor Granites Showroom & Craft"
                className="w-full h-[520px] object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              {/* Founder Overlay Box */}
              <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl border border-white/20 bg-black/80 backdrop-blur-md text-white shadow-2xl">
                <span className="text-[10px] uppercase tracking-[0.25em] text-accent-gold font-bold block mb-1">
                  Visionary Leadership
                </span>
                <h3 className="font-serif text-2xl font-bold text-white">{COMPANY_INFO.founder}</h3>
                <p className="text-xs text-gray-300 mt-1 font-sans">Founder & Managing Director, Sri Senthoor Granites</p>
                <p className="text-xs text-gray-200 italic mt-3 border-t border-white/20 pt-2.5 font-sans">
                  "Every granite vein tells millions of years of earth history. We exist to bring that permanence into your sanctuary."
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Brand Story & Pillars */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <div className="space-y-4 text-gray-700 leading-relaxed font-sans">
              <p className="text-lg">
                Located prominently at <strong className="text-gray-900 font-semibold">{COMPANY_INFO.address.landmark}, Trichy</strong>, Sri Senthoor Granites stands as the premier destination for architects, interior designers, and discerning homeowners across Tamil Nadu.
              </p>
              <p className="text-base text-gray-600">
                We bridge the gap between world-class granite quarries and luxury living spaces. From high-gloss mirror granites to precision rectified vitrified porcelain tiles, dark authentic Cuddapah Kadappa slabs, and opulent bath fixtures—our curation guarantees unmatched structural integrity and aesthetic perfection.
              </p>
            </div>

            {/* 4 Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl border border-gray-200 hover:border-black bg-white shadow-sm hover:shadow-lg transition-all group">
                <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center mb-3 shadow-md">
                  <Gem className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-lg font-bold text-gray-900 group-hover:text-accent-gold transition-colors">Hand-Picked Quarries</h4>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">Direct inspection & grading of every stone slab before delivery.</p>
              </div>

              <div className="p-6 rounded-2xl border border-gray-200 hover:border-black bg-white shadow-sm hover:shadow-lg transition-all group">
                <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center mb-3 shadow-md">
                  <Compass className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-lg font-bold text-gray-900 group-hover:text-accent-gold transition-colors">Architectural Guidance</h4>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">Bespoke recommendations matched to your structural layout.</p>
              </div>

              <div className="p-6 rounded-2xl border border-gray-200 hover:border-black bg-white shadow-sm hover:shadow-lg transition-all group">
                <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center mb-3 shadow-md">
                  <Award className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-lg font-bold text-gray-900 group-hover:text-accent-gold transition-colors">Precision Cut & Polish</h4>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">Factory calibrated thickness ensuring seamless edge fitting.</p>
              </div>

              <div className="p-6 rounded-2xl border border-gray-200 hover:border-black bg-white shadow-sm hover:shadow-lg transition-all group">
                <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center mb-3 shadow-md">
                  <UserCheck className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-lg font-bold text-gray-900 group-hover:text-accent-gold transition-colors">Priority Client Service</h4>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">Personalized support led directly by founder Arshath & team.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Counter Stats Bar */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 bg-black text-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-gray-800 text-center">
          {COMPANY_STATS.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <span className="font-serif text-4xl sm:text-5xl font-extrabold text-accent-gold tracking-tight">
                {stat.value}
              </span>
              <span className="text-xs uppercase tracking-widest text-gray-400 mt-2 font-mono font-medium">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
