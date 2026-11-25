import React from 'react';
import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'white';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  href,
  icon,
  children,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-[#1E40AF] hover:bg-[#1e3a8a] text-white shadow-sm hover:shadow focus:ring-[#1E40AF]',
    secondary:
      'bg-[#3B82F6] hover:bg-blue-600 text-white shadow-sm hover:shadow focus:ring-[#3B82F6]',
    outline:
      'border-2 border-[#1E40AF] text-[#1E40AF] hover:bg-[#EFF6FF] focus:ring-[#1E40AF]',
    white:
      'bg-white text-[#172554] hover:bg-slate-100 shadow-sm focus:ring-white',
  };

  const widthStyle = fullWidth ? 'w-full' : '';
  const combinedClass = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={combinedClass}>
        {children}
        {icon && <span className="inline-flex items-center">{icon}</span>}
      </Link>
    );
  }

  return (
    <button className={combinedClass} {...props}>
      {children}
      {icon && <span className="inline-flex items-center">{icon}</span>}
    </button>
  );
};

