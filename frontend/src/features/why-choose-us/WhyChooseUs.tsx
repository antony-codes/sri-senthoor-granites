import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { ShieldCheck, Sliders, Layers, UserCheck, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { SectionHeader } from '@/components/common/SectionHeader';

const REASONS = [
  {
    number: '01',
    icon: <ShieldCheck className="w-6 h-6 text-white" />,
    title: 'Direct Quarry Sourcing',
    highlight: 'Zero Middlemen • 100% Grade-A',
    description: 'Procured directly from South India’s finest granite quarries to deliver authentic natural stone with zero markup and total origin traceability.',
    points: ['Direct quarry slab inspection', 'Authentic mineral vein patterns', 'Quarry-direct wholesale pricing'],
    badge: 'Quarry Pure',
  },
  {
    number: '02',
    icon: <Sliders className="w-6 h-6 text-white" />,
    title: 'Precision Diamond Cutting',
    highlight: 'Mirror Finish • Multi-Axis Polish',
    description: 'Processed with automated multi-head diamond polishing machinery for laser-straight edges, zero flaking, and mirror reflectivity.',
    points: ['Uniform 18mm & 20mm slab thickness', 'Seamless joint alignment', 'Scratch & thermal shock resistant'],
    badge: 'Precision Edge',
  },
  {
    number: '03',
    icon: <Layers className="w-6 h-6 text-white" />,
    title: 'All-in-One Architectural Suite',
    highlight: 'Granites • Tiles • Kadappa • Bathware',
    description: 'Trichy’s comprehensive destination for premium natural granites, vitrified porcelain slabs, black Kadappa, and luxury bath suites under one roof.',
    points: ['Full home material color matching', 'Extensive live showroom inventory', 'Streamlined one-stop procurement'],
    badge: 'Complete Suite',
  },
  {
    number: '04',
    icon: <UserCheck className="w-6 h-6 text-white" />,
    title: 'Founder Direct Oversight',
    highlight: 'Personal Quality Guarantee',
    description: 'Founder Arshath and our stone specialists personally oversee every sample approval, custom edge profiling, and damage-free site delivery.',
    points: ['Dedicated founder consultation', 'Bespoke edge profiling & cut-outs', 'Safe transit & site unload warranty'],
    badge: 'Founder Certified',
  },
];

interface CardProps {
  reason: (typeof REASONS)[0];
  index: number;
  total: number;
  progress: MotionValue<number>;
}

const StackingCard: React.FC<CardProps> = ({ reason, index, total, progress }) => {
  // Compute target depth scale and opacity when subsequent cards stack on top
  const targetScale = 1 - (total - 1 - index) * 0.04;
  const startRange = index / total;
  const endRange = 1;

  const scale = useTransform(progress, [startRange, endRange], [1, targetScale]);
  const opacity = useTransform(progress, [startRange, endRange], [1, 0.8 + index * 0.05]);

  return (
    <div className="sticky top-24 sm:top-28 mb-8 sm:mb-12 flex justify-center">
      <motion.div
        style={{
          scale,
          opacity,
          top: `calc(5.5rem + ${index * 16}px)`,
        }}
        className="w-full max-w-4xl bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group"
      >
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-black" />

        {/* Ambient Subtle Glow Accent */}
        <div className="absolute -right-16 -bottom-16 w-56 h-56 bg-gray-100 rounded-full blur-3xl opacity-50 pointer-events-none group-hover:opacity-100 transition-opacity" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 sm:gap-8">
          {/* Main Info */}
          <div className="space-y-4 flex-1">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <span className="font-sans text-xs sm:text-sm font-extrabold text-black bg-gray-100 px-3 py-1 rounded-full border border-gray-200 shadow-2xs">
                  {reason.number}
                </span>
                <span className="text-[10px] sm:text-xs uppercase font-bold tracking-widest text-gray-500">
                  {reason.highlight}
                </span>
              </div>

              <span className="text-[10px] uppercase tracking-widest font-extrabold text-black bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-200 hidden sm:inline-block">
                {reason.badge}
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="font-sans text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 group-hover:text-black transition-colors">
                <span>{reason.title}</span>
                <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0" />
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 font-sans leading-relaxed max-w-2xl">
                {reason.description}
              </p>
            </div>

            {/* Checkpoints */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
              {reason.points.map((pt) => (
                <div key={pt} className="flex items-center gap-2 text-xs font-semibold text-gray-800 bg-gray-50/80 p-2.5 rounded-xl border border-gray-100">
                  <CheckCircle2 className="w-4 h-4 text-black shrink-0" />
                  <span className="truncate">{pt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Icon Badge */}
          <div className="shrink-0 self-start md:self-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-black text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
              {reason.icon}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const WhyChooseUs: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section
      id="why-choose-us"
      className="py-14 sm:py-20 relative bg-white text-gray-900 font-sans border-t border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          title="The Sri Senthoor"
          highlightTitle="Standard"
          subtitle="Exceptional materials, refined finishes, and a commitment to every detail."
        />

        {/* Smooth Scroll Stacking Cards Deck */}
        <div ref={containerRef} className="relative pb-16">
          {REASONS.map((reason, idx) => (
            <StackingCard
              key={reason.number}
              reason={reason}
              index={idx}
              total={REASONS.length}
              progress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
