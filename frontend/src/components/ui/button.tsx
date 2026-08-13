import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-xs font-bold uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.98]',
  {
    variants: {
      variant: {
        default: 'bg-black text-white hover:bg-gray-800 shadow-sm border border-black',
        primary: 'bg-black text-white hover:bg-gray-800 shadow-sm border border-black',
        destructive: 'bg-red-600 text-white hover:bg-red-700 shadow-sm border border-red-600',
        outline: 'border border-gray-200 bg-white text-gray-800 hover:border-black hover:bg-gray-50 shadow-2xs',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-200',
        ghost: 'text-gray-700 hover:bg-gray-100 hover:text-black',
        link: 'text-black underline-offset-4 hover:underline p-0 h-auto font-normal normal-case tracking-normal',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 text-[11px]',
        lg: 'h-12 px-6 text-xs',
        icon: 'h-9 w-9 p-0 rounded-xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
