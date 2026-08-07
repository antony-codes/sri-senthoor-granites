import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  onClick,
  ...props
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.25, y: middleY * 0.25 });
  };

  const resetPosition = () => {
    setPosition({ x: 0, y: 0 });
  };

  const variants = {
    primary: 'bg-accent-gold text-obsidian-950 hover:bg-yellow-500 font-semibold shadow-lg shadow-accent-goldGlow',
    secondary: 'bg-silver-100 text-obsidian-950 hover:bg-white dark:bg-silver-200 dark:hover:bg-white font-medium',
    outline: 'border border-accent-gold/40 text-accent-gold hover:bg-accent-gold/10 font-medium',
    glass: 'glass-panel text-silver-100 hover:border-accent-gold/50 hover:bg-white/10 font-medium',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs tracking-wider uppercase',
    md: 'px-6 py-3 text-sm tracking-wider uppercase',
    lg: 'px-8 py-4 text-base tracking-widest uppercase',
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetPosition}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 15, mass: 0.1 }}
      onClick={onClick}
      className={cn(
        'relative inline-flex items-center justify-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent-gold/50 disabled:opacity-50 cursor-pointer overflow-hidden group',
        variants[variant],
        sizes[size],
        className
      )}
      {...(props as any)}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-full" />
    </motion.button>
  );
};
