import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: 'sm' | 'md' | 'lg' | 'none';
  noPadding?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', elevation = 'sm', noPadding = false, children, ...props }, ref) => {
    const elevations = {
      none: 'border border-slate-200',
      sm: 'border border-slate-200 shadow-sm',
      md: 'border border-slate-200 shadow-md',
      lg: 'border border-slate-200 shadow-lg',
    };
    
    return (
      <div
        ref={ref}
        className={`bg-white rounded-xl overflow-hidden ${elevations[elevation]} ${className}`}
        {...props}
      >
        {noPadding ? children : <div className="p-5">{children}</div>}
      </div>
    );
  }
);
Card.displayName = 'Card';

export const CardHeader = ({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`px-5 py-4 border-b border-slate-100 flex items-center justify-between ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ className = '', children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={`text-lg font-semibold text-slate-900 leading-none tracking-tight ${className}`} {...props}>
    {children}
  </h3>
);

export const CardContent = ({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`p-5 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`px-5 py-4 bg-slate-50 border-t border-slate-100 flex items-center ${className}`} {...props}>
    {children}
  </div>
);
