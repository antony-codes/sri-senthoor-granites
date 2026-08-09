import React from 'react';
import { ShieldCheck, Sliders, Layers, UserCheck, CheckCircle2 } from 'lucide-react';
import { SectionHeader } from '@/components/common/SectionHeader';

const REASONS = [
  {
    number: '01',
    icon: <ShieldCheck className="w-4 h-4 text-white" />,
    title: 'Direct Quarry Sourcing',
    highlight: 'Zero Middlemen • 100% Grade-A',
    description: 'Procured directly from South India’s finest quarries to deliver authentic natural stone without price markups.',
    points: ['Direct quarry slab inspection', 'Authentic mineral vein patterns', 'Quarry-direct pricing'],
  },
  {
    number: '02',
    icon: <Sliders className="w-4 h-4 text-white" />,
    title: 'Precision Diamond Cutting',
    highlight: 'Mirror Finish • Calibrated',
    description: 'Processed using multi-stage diamond polishing machinery for laser-straight edges and mirror reflectivity.',
    points: ['Uniform 18mm & 20mm slab thickness', 'Seamless joint alignment', 'Scratch & heat resistant'],
  },
  {
    number: '03',
    icon: <Layers className="w-4 h-4 text-white" />,
    title: 'All-in-One Architectural Suite',
    highlight: 'Granites • Tiles • Kadappa • Bathware',
    description: 'Trichy’s comprehensive destination for natural stone, vitrified slabs, black Kadappa, and bath suites.',
    points: ['Full home material matching', 'Extensive live showroom stock', 'One-stop procurement'],
  },
  {
    number: '04',
    icon: <UserCheck className="w-4 h-4 text-white" />,
    title: 'Founder Direct Oversight',
    highlight: 'Personal Quality Guarantee',
    description: 'Founder Arshath and our team personally oversee every sample review, custom edge profile, and site delivery.',
    points: ['Dedicated founder consultation', 'Bespoke edge profiling', 'Damage-free site delivery'],
  },
];

export const WhyChooseUs: React.FC = () => {
  return (
    <section id="why-choose-us" className="py-12 sm:py-16 relative overflow-hidden bg-white text-gray-900 font-sans border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          title="Why Choose"
          highlightTitle="Sri Senthoor Granites"
          subtitle="Four core commitments that define our material purity, precision finishing, and client dedication."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {REASONS.map((reason) => (
            <div
              key={reason.number}
              className="relative p-6 sm:p-8 rounded-2xl border border-gray-200 hover:border-black bg-white shadow-sm transition-all flex flex-col justify-between group overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-black" />

              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="font-sans text-[11px] font-bold text-black bg-gray-100 px-2.5 py-0.5 rounded-full">
                      {reason.number}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gray-700">
                      {reason.highlight}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center shadow-sm">
                    {reason.icon}
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-sans text-lg font-bold text-gray-900">
                    {reason.title}
                  </h3>
                  <p className="text-xs text-gray-500 font-sans leading-relaxed">
                    {reason.description}
                  </p>
                </div>

                <div className="pt-1 space-y-1.5">
                  {reason.points.map((pt) => (
                    <div key={pt} className="flex items-center gap-2 text-xs font-medium text-gray-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-black shrink-0" />
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
