import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  hoverEffect = true,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'relative rounded-2xl p-6 sm:p-8 backdrop-blur-xl border border-black/10 bg-white/80 text-gray-900 shadow-xl transition-all duration-300 overflow-hidden group',
        hoverEffect && 'hover:border-accent-gold/50 hover:shadow-accent-goldGlow hover:-translate-y-1',
        className
      )}
    >
      <div className="absolute -top-[100px] -right-[100px] w-48 h-48 bg-accent-gold/10 rounded-full blur-3xl group-hover:bg-accent-gold/20 transition-all duration-700 pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};
