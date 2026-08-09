import React from 'react';
import { cn } from '@/utils/cn';

interface SectionHeaderProps {
  badge?: string;
  title: string;
  highlightTitle?: string;
  subtitle?: string;
  alignment?: 'left' | 'center' | 'right';
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  highlightTitle,
  subtitle,
  alignment = 'center',
  className,
}) => {
  const alignClass = {
    left: 'text-left items-start',
    center: 'text-center items-center mx-auto',
    right: 'text-right items-end ml-auto',
  };

  return (
    <div className={cn('flex flex-col max-w-2xl mb-8 sm:mb-10', alignClass[alignment], className)}>
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold tracking-tight text-gray-900 leading-tight">
        {title}{' '}
        {highlightTitle && (
          <span className="text-accent-gold font-normal">{highlightTitle}</span>
        )}
      </h2>

      {subtitle && (
        <p className="text-xs sm:text-sm text-gray-500 font-sans leading-relaxed mt-2.5 max-w-xl">
          {subtitle}
        </p>
      )}
    </div>
  );
};
