import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default: 'bg-emerald-600 text-white shadow-md shadow-emerald-900/15 hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-900/25 hover:-translate-y-0.5',
        destructive: 'bg-red-600 text-white shadow-md shadow-red-900/15 hover:bg-red-700 hover:shadow-lg hover:shadow-red-900/25',
        outline: 'border border-gray-200 bg-white text-gray-700 shadow-sm hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-emerald-800',
        secondary: 'bg-gray-100 text-gray-700 shadow-sm hover:bg-gray-200 hover:text-gray-900',
        ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
        link: 'text-emerald-600 underline-offset-4 hover:underline',
        glow: 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-500/40 hover:-translate-y-0.5',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-lg px-3 text-xs',
        lg: 'h-12 rounded-xl px-8 text-base',
        icon: 'h-9 w-9 rounded-xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

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
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
