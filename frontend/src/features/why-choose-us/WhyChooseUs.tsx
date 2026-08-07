import React from 'react';
import { ShieldCheck, Sparkles, Scale, Sliders, HeartHandshake } from 'lucide-react';
import { SectionHeader } from '@/components/common/SectionHeader';
import { GlassCard } from '@/components/common/GlassCard';

const PILLARS = [
  {
    icon: <ShieldCheck className="w-6 h-6 text-accent-gold" />,
    title: 'Direct Quarry Sourcing',
    description: 'We directly procure pristine natural granite blocks from premier South Indian quarries, eliminating middleman inflation and guaranteeing true grade-A density.',
  },
  {
    icon: <Sliders className="w-6 h-6 text-accent-gold" />,
    title: 'Factory Precision Calibration',
    description: 'State-of-the-art diamond blade cutting and multi-stage polishing equipment ensure uniform thickness, laser-straight edges, and mirror reflectivity.',
  },
  {
    icon: <Scale className="w-6 h-6 text-accent-gold" />,
    title: 'Comprehensive Luxury Suite',
    description: 'One single destination in Trichy for Granites, Vitrified Tiles, Kadappa Stone, Sanitary Wares, and Bath Fittings—enabling seamless aesthetic harmonization.',
  },
  {
    icon: <Sparkles className="w-6 h-6 text-accent-gold" />,
    title: 'Custom Edge Profiling',
    description: 'From classic full-bullnose kitchen islands to waterfall edge cuts and flamed anti-slip patio slabs, our master stonemasons tailor every edge to your blueprint.',
  },
  {
    icon: <HeartHandshake className="w-6 h-6 text-accent-gold" />,
    title: 'Founder Care & Integrity',
    description: 'Led by founder Arshath, every client consultation, sample review, and site shipment receives personal oversight so your choices remain our topmost priority.',
  },
];

export const WhyChooseUs: React.FC = () => {
  return (
    <section id="why-choose-us" className="py-24 sm:py-32 relative overflow-hidden bg-gray-50 text-gray-900 transition-colors font-sans">
      {/* Glow Effects */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-accent-gold/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          badge="The Sri Senthoor Advantage"
          title="Why Architectural Leaders & Homeowners"
          highlightTitle="Choose Sri Senthoor Granites"
          subtitle="Our unyielding dedication to material purity, quarry transparency, and bespoke stone finishing distinguishes us across Tamil Nadu."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PILLARS.map((pillar, index) => (
            <GlassCard
              key={pillar.title}
              hoverEffect
              className={`p-8 flex flex-col justify-between ${
                index === 4 ? 'md:col-span-2 lg:col-span-1 border-accent-gold/30 bg-accent-gold/5' : ''
              }`}
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-accent-gold/10 border border-accent-gold/30 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(197,160,89,0.15)]">
                  {pillar.icon}
                </div>
                <h3 className="font-serif text-2xl font-bold text-gray-900 mb-3">{pillar.title}</h3>
                <p className="text-sm text-gray-600 font-sans leading-relaxed">{pillar.description}</p>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-200 flex items-center justify-between text-xs text-accent-gold uppercase tracking-widest font-semibold font-mono">
                <span>Pillar 0{index + 1}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-accent-gold" />
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
};
