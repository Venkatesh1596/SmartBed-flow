import React from 'react';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
export type BadgeSize = 'sm' | 'md';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = '', variant = 'default', size = 'md', children, ...props }, ref) => {
    
    const variants = {
      default: 'bg-slate-100 text-slate-700',
      success: 'bg-success-50 text-success-700 border border-success-500/20',
      warning: 'bg-warning-50 text-warning-700 border border-warning-500/20',
      danger: 'bg-danger-50 text-danger-700 border border-danger-500/20',
      info: 'bg-info-50 text-info-700 border border-info-500/20',
      outline: 'text-slate-600 border border-slate-300',
    };

    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-0.5 text-sm',
    };

    return (
      <span
        ref={ref}
        className={`inline-flex items-center justify-center font-medium rounded-full whitespace-nowrap ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </span>
    );
  }
);
Badge.displayName = 'Badge';

export default Badge;
