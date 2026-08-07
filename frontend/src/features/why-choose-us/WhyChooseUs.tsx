import React from 'react';
import { ShieldCheck, Sliders, Layers, UserCheck, CheckCircle2 } from 'lucide-react';
import { SectionHeader } from '@/components/common/SectionHeader';

const REASONS = [
  {
    number: '01',
    icon: <ShieldCheck className="w-5 h-5 text-accent-gold" />,
    title: 'Direct Quarry Sourcing',
    highlight: 'Zero Middlemen • 100% Grade-A Density',
    description: 'Procured directly from South India’s finest quarries to deliver authentic, high-density natural stone without price markups.',
    points: ['Direct quarry slab inspection', 'Authentic mineral vein patterns', 'Unbeatable quarry-direct pricing'],
  },
  {
    number: '02',
    icon: <Sliders className="w-5 h-5 text-accent-gold" />,
    title: 'Precision Diamond Cutting',
    highlight: 'Mirror Finish • Calibrated Thickness',
    description: 'Processed using multi-stage diamond polishing machinery for laser-straight edges and flawless mirror reflectivity.',
    points: ['Uniform 18mm & 20mm slab thickness', 'Seamless joint alignment', 'Scratch & heat resistant surfaces'],
  },
  {
    number: '03',
    icon: <Layers className="w-5 h-5 text-accent-gold" />,
    title: 'All-in-One Architectural Suite',
    highlight: 'Granites • Tiles • Kadappa • Bathware',
    description: 'Trichy’s comprehensive destination for natural stone, vitrified slabs, authentic black Kadappa, and designer bath suites.',
    points: ['Full home material matching', 'Extensive live showroom stock', 'One-stop procurement convenience'],
  },
  {
    number: '04',
    icon: <UserCheck className="w-5 h-5 text-accent-gold" />,
    title: 'Founder Direct Oversight',
    highlight: 'Personal Quality Guarantee',
    description: 'Founder Arshath and our team personally oversee every sample review, custom edge profile, and site delivery.',
    points: ['Dedicated founder consultation', 'Bespoke edge profiling', 'On-time damage-free site delivery'],
  },
];

export const WhyChooseUs: React.FC = () => {
  return (
    <section id="why-choose-us" className="py-14 sm:py-20 relative overflow-hidden bg-white text-gray-900 font-sans border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          badge="The Sri Senthoor Advantage"
          title="Why Architects & Homeowners"
          highlightTitle="Choose Sri Senthoor Granites"
          subtitle="Four core commitments that define our material purity, precision finishing, and client dedication."
        />

        {/* Clean Static Showcase Grid with ZERO Scroll Animation Delay */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {REASONS.map((reason) => (
            <div
              key={reason.number}
              className="relative p-8 sm:p-10 rounded-3xl border border-gray-200 hover:border-black bg-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group overflow-hidden"
            >
              {/* Gold Top Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-accent-gold" />

              <div className="space-y-6">
                {/* Number & Icon Header */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-black bg-gray-100 px-3 py-1 rounded-full">
                      {reason.number}
                    </span>
                    <span className="text-xs uppercase font-extrabold tracking-widest text-accent-gold">
                      {reason.highlight}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center shadow-md">
                    {reason.icon}
                  </div>
                </div>

                {/* Title & Description */}
                <div className="space-y-2">
                  <h3 className="font-serif text-2xl font-bold text-gray-900">
                    {reason.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 font-sans leading-relaxed">
                    {reason.description}
                  </p>
                </div>

                {/* Clear Bullet Points */}
                <div className="pt-2 space-y-2">
                  {reason.points.map((pt) => (
                    <div key={pt} className="flex items-center gap-2.5 text-xs font-semibold text-gray-800">
                      <CheckCircle2 className="w-4 h-4 text-accent-gold shrink-0" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
