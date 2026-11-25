'use client';

import React from 'react';
import { useOrganisation } from '@/context/OrganisationContext';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { GraduationCap, BookOpenCheck, UserCheck, Trophy } from 'lucide-react';

const icons = [GraduationCap, BookOpenCheck, UserCheck, Trophy];

export const Features: React.FC = () => {
  const { homePage, organisation } = useOrganisation();

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-theme-surface border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          subtitle="Why Choose Us"
          title={`The Core Pillars of ${organisation.name}`}
          description="We combine traditional teaching integrity with modern diagnostic assessments to ensure every student builds true subject confidence."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {homePage.features.map((feat, idx) => {
            const Icon = icons[idx % icons.length];
            return (
              <div
                key={idx}
                className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 hover:border-slate-300"
              >
                <div>
                  <div className="w-12 h-12 rounded-lg bg-theme-light border border-theme-primary/20 flex items-center justify-center text-theme-primary mb-5 group-hover:bg-theme-primary group-hover:text-white transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-theme-navy mb-2 group-hover:text-theme-primary transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                    {feat.description}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-theme-primary tracking-wide uppercase">
                    {feat.highlight}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
