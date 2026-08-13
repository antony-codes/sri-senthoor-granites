import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider transition-colors focus:outline-none',
  {
    variants: {
      variant: {
        default: 'border border-transparent bg-black text-white shadow-2xs',
        secondary: 'border border-gray-200 bg-gray-100 text-gray-800',
        outline: 'border border-gray-300 text-gray-700 bg-white',
        success: 'border border-emerald-200 bg-emerald-100 text-emerald-800',
        warning: 'border border-amber-200 bg-amber-100 text-amber-800',
        info: 'border border-blue-200 bg-blue-100 text-blue-800',
        destructive: 'border border-red-200 bg-red-100 text-red-800',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
