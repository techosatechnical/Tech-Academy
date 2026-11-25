import React from 'react';

interface SectionTitleProps {
  subtitle?: string;
  title: string;
  description?: string;
  centered?: boolean;
  light?: boolean;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  subtitle,
  title,
  description,
  centered = true,
  light = false,
}) => {
  return (
    <div className={`mb-12 ${centered ? 'text-center mx-auto max-w-3xl' : 'max-w-2xl'}`}>
      {subtitle && (
        <span
          className={`inline-block text-xs font-bold tracking-widest uppercase mb-2 px-3 py-1 rounded-full ${
            light
              ? 'bg-white/10 text-white border border-white/20'
              : 'bg-theme-light text-theme-primary border border-theme-primary/20'
          }`}
        >
          {subtitle}
        </span>
      )}
      <h2
        className={`text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4 ${
          light ? 'text-white' : 'text-theme-navy'
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`text-base sm:text-lg leading-relaxed ${
            light ? 'text-slate-200' : 'text-slate-600'
          }`}
        >
          {description}
        </p>
      )}
      <div
        className={`h-1 w-16 bg-theme-primary mt-4 rounded-full ${
          centered ? 'mx-auto' : ''
        } ${light ? 'bg-white' : ''}`}
      />
    </div>
  );
};
