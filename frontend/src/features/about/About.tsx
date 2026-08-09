import React from 'react';
import { Award, Compass, Gem, UserCheck } from 'lucide-react';
import { SectionHeader } from '@/components/common/SectionHeader';
import { COMPANY_INFO, COMPANY_STATS } from '@/constants/company';

const PILLARS = [
  {
    icon: <Gem className="w-4 h-4" />,
    title: 'Direct Quarry Sourcing',
    desc: 'Direct inspection and grading of every natural stone slab.',
  },
  {
    icon: <Compass className="w-4 h-4" />,
    title: 'Architectural Guidance',
    desc: 'Bespoke recommendations tailored to your structural layout.',
  },
  {
    icon: <Award className="w-4 h-4" />,
    title: 'Precision Cut & Polish',
    desc: 'Factory calibrated thickness ensuring seamless edge fitting.',
  },
  {
    icon: <UserCheck className="w-4 h-4" />,
    title: 'Founder Direct Oversight',
    desc: 'Personalized service led directly by founder Arshath & team.',
  },
];

export const About: React.FC = () => {
  return (
    <section id="about" className="py-12 sm:py-16 relative overflow-hidden bg-white text-gray-900 font-sans border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          title="About Sri Senthoor"
          highlightTitle="Granites"
          subtitle={`Founded in ${COMPANY_INFO.established} by ${COMPANY_INFO.founder}, built on a non-negotiable philosophy: "${COMPANY_INFO.slogan}".`}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Founder Image Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-gray-200 shadow-md group bg-black">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80"
                alt="Sri Senthoor Granites Showroom"
                className="w-full h-[400px] sm:h-[440px] object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

              <div className="absolute bottom-5 left-5 right-5 p-5 rounded-2xl border border-white/20 bg-black/85 backdrop-blur-md text-white shadow-lg">
                <span className="text-[10px] uppercase tracking-wider text-gray-300 font-bold block mb-0.5">
                  Leadership
                </span>
                <h3 className="font-serif text-xl font-bold text-white">{COMPANY_INFO.founder}</h3>
                <p className="text-xs text-gray-300 font-sans">Founder & Managing Director</p>
                <p className="text-xs text-gray-200 italic mt-2.5 border-t border-white/20 pt-2 font-sans leading-relaxed">
                  "Every granite vein tells millions of years of earth history. We bring that permanence into your sanctuary."
                </p>
              </div>
            </div>
          </div>

          {/* Story & Pillars */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="space-y-3 text-gray-600 leading-relaxed font-sans text-xs sm:text-sm">
              <p>
                Located prominently at <strong className="text-gray-900 font-semibold">{COMPANY_INFO.address.landmark}, Trichy</strong>, Sri Senthoor Granites is Trichy’s trusted destination for architects, interior designers, and homeowners.
              </p>
              <p>
                We bridge the gap between South India's finest quarries and luxury living spaces—offering high-gloss granites, vitrified porcelain tiles, natural Kadappa stone, and designer bath fittings.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {PILLARS.map((pillar) => (
                <div
                  key={pillar.title}
                  className="p-5 rounded-2xl border border-gray-200 hover:border-black bg-white shadow-sm transition-all group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center mb-2.5 shadow-sm">
                    {pillar.icon}
                  </div>
                  <h4 className="font-serif text-base font-bold text-gray-900">
                    {pillar.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{pillar.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Counter Stats Bar */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 bg-black text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-800 text-center">
          {COMPANY_STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <span className="font-serif text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {stat.value}
              </span>
              <span className="text-[11px] uppercase tracking-wider text-gray-400 mt-1 font-mono font-medium">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
