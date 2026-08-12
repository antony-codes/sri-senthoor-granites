import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
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

interface Stat3DCardProps {
  label: string;
  rawValue: string;
  index: number;
}

const Stat3DCard: React.FC<Stat3DCardProps> = ({ label, rawValue, index }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // Remove once: true so scrolling up re-triggers count-up & 3D reveal
  const isInView = useInView(containerRef, { amount: 0.3 });
  const [displayNumber, setDisplayNumber] = useState('0');

  // Parse target number, decimal places, and static suffix
  let targetNum = 0;
  let suffix = '';
  let decimals = 0;

  if (rawValue.includes('M+')) {
    targetNum = parseFloat(rawValue.replace('M+', ''));
    suffix = 'M+';
    decimals = 0;
  } else if (rawValue.includes('+')) {
    targetNum = parseFloat(rawValue.replace('+', ''));
    suffix = '+';
    decimals = 0;
  } else if (rawValue.includes('%')) {
    targetNum = parseFloat(rawValue.replace('%', ''));
    suffix = '%';
    decimals = 1;
  } else {
    targetNum = parseFloat(rawValue) || 0;
  }

  useEffect(() => {
    if (!isInView) {
      setDisplayNumber('0');
      return;
    }

    let startTimestamp: number | null = null;
    const duration = 1800; // 1.8 second smooth count-up

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Apple cubic easing out
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = targetNum * easedProgress;

      setDisplayNumber(currentVal.toFixed(decimals));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayNumber(targetNum.toFixed(decimals));
      }
    };

    const animFrame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animFrame);
  }, [isInView, targetNum, decimals]);

  return (
    <motion.div
      ref={containerRef}
      initial={{
        opacity: 0,
        y: 40,
        rotateX: 20,
        scale: 0.85,
        filter: 'blur(10px)',
      }}
      animate={
        isInView
          ? {
            opacity: 1,
            y: 0,
            rotateX: 0,
            scale: 1,
            filter: 'blur(0px)',
          }
          : {
            opacity: 0,
            y: 40,
            rotateX: 20,
            scale: 0.85,
            filter: 'blur(10px)',
          }
      }
      transition={{
        duration: 0.8,
        delay: index * 0.12,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -6, scale: 1.04 }}
      style={{ transformStyle: 'preserve-3d' }}
      className="flex flex-col items-center justify-center p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/25 backdrop-blur-md transition-all duration-300 transform-gpu cursor-default shadow-lg"
    >
      {/* 3D Elevated Number Value */}
      <div style={{ transform: 'translateZ(30px)' }} className="flex items-baseline font-sans text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-none drop-shadow-md">
        <span>{displayNumber}</span>
        <span className="text-gray-300 ml-0.5 font-bold">{suffix}</span>
      </div>

      {/* 3D Elevated Label Spec */}
      <span style={{ transform: 'translateZ(15px)' }} className="text-[10px] sm:text-[11px] uppercase tracking-widest text-gray-400 mt-2.5 font-sans font-semibold text-center leading-snug">
        {label}
      </span>
    </motion.div>
  );
};

export const About: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Real-time continuous scroll tracking for About section (works bidirectionally for scroll down AND scroll up!)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 90, damping: 22 });

  // 3D Motion transforms mapped continuously to user scroll position
  const founderRotateY = useTransform(smoothProgress, [0, 0.45, 1], [-12, 0, 10]);
  const founderScale = useTransform(smoothProgress, [0, 0.45, 1], [0.91, 1, 0.94]);
  const founderY = useTransform(smoothProgress, [0, 0.45, 1], [50, 0, -30]);

  const pillarsY = useTransform(smoothProgress, [0, 0.45, 1], [40, 0, -20]);
  const pillarsRotateX = useTransform(smoothProgress, [0, 0.45, 1], [10, 0, -8]);

  const statsY = useTransform(smoothProgress, [0, 0.5, 1], [45, 0, -20]);
  const statsScale = useTransform(smoothProgress, [0, 0.5, 1], [0.92, 1, 0.95]);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="py-12 sm:py-16 relative overflow-hidden bg-white text-gray-900 font-sans border-t border-gray-100 perspective-1000"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          title="About Sri Senthoor"
          highlightTitle="Granites"
          subtitle={`Founded in ${COMPANY_INFO.established} by ${COMPANY_INFO.founder}, built on a non-negotiable philosophy: "${COMPANY_INFO.slogan}".`}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center perspective-1000">
          {/* Founder Image Card with Continuous Scroll-Driven 3D Depth */}
          <motion.div
            style={{
              rotateY: founderRotateY,
              scale: founderScale,
              y: founderY,
              transformStyle: 'preserve-3d',
            }}
            className="lg:col-span-5 relative transform-gpu"
          >
            <div className="relative rounded-3xl overflow-hidden border border-gray-200 shadow-xl group bg-black">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80"
                alt="Sri Senthoor Granites Showroom"
                className="w-full h-[400px] sm:h-[440px] object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

              <div style={{ transform: 'translateZ(35px)' }} className="absolute bottom-5 left-5 right-5 p-5 rounded-2xl border border-white/20 bg-black/85 backdrop-blur-md text-white shadow-2xl">
                <span className="text-[10px] uppercase tracking-wider text-gray-300 font-bold block mb-0.5">
                  Leadership
                </span>
                <h3 className="font-sans text-xl font-bold text-white">{COMPANY_INFO.founder}</h3>
                <p className="text-xs text-gray-300 font-sans">Founder & Managing Director</p>
                <p className="text-xs text-gray-200 italic mt-2.5 border-t border-white/20 pt-2 font-sans leading-relaxed">
                  "Every granite vein tells millions of years of earth history. We bring that permanence into your sanctuary."
                </p>
              </div>
            </div>
          </motion.div>

          {/* Story & Pillars with Continuous Scroll-Driven 3D Elevation */}
          <motion.div
            style={{
              y: pillarsY,
              rotateX: pillarsRotateX,
              transformStyle: 'preserve-3d',
            }}
            className="lg:col-span-7 flex flex-col gap-6 transform-gpu"
          >
            <div className="space-y-3 text-gray-600 leading-relaxed font-sans text-xs sm:text-sm">
              <p>
                Located prominently at <strong className="text-gray-900 font-semibold">{COMPANY_INFO.address.landmark}, Trichy</strong>, Sri Senthoor Granites is Trichy’s trusted destination for architects, interior designers, and homeowners.
              </p>
              <p>
                We bridge the gap between South India's finest quarries and luxury living spaces—offering high-gloss granites, vitrified porcelain tiles, natural Kadappa stone, and designer bath fittings.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 perspective-1000">
              {PILLARS.map((pillar) => (
                <motion.div
                  key={pillar.title}
                  whileHover={{ y: -4, scale: 1.02 }}
                  style={{ transformStyle: 'preserve-3d' }}
                  className="p-5 rounded-2xl border border-gray-200 hover:border-black bg-white shadow-sm hover:shadow-md transition-all group cursor-pointer transform-gpu"
                >
                  <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center mb-2.5 shadow-sm group-hover:scale-105 transition-transform">
                    {pillar.icon}
                  </div>
                  <h4 className="font-sans text-base font-bold text-gray-900">
                    {pillar.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{pillar.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Premium 3D Number Reveal Statistics Section */}
        <motion.div
          style={{
            y: statsY,
            scale: statsScale,
            transformStyle: 'preserve-3d',
          }}
          className="mt-12 bg-black text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-800 perspective-1000 transform-gpu"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {COMPANY_STATS.map((stat, idx) => (
              <Stat3DCard
                key={stat.label}
                label={stat.label}
                rawValue={stat.value}
                index={idx}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
