'use client';

import React from 'react';
import Image from 'next/image';
import { useOrganisation } from '@/context/OrganisationContext';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Star, Quote } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const { testimonials, organisation } = useOrganisation();

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          subtitle="Student Experiences"
          title={`What Our Students & Parents Say About ${organisation.name}`}
          description="Real reflections from learners who transformed their academic journey with us."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {testimonials.map((test) => (
            <div
              key={test.id}
              className="bg-theme-surface rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                {/* Rating & Quote Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-slate-300" />
                </div>

                {/* Feedback */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic mb-6">
                  &quot;{test.feedback}&quot;
                </p>
              </div>

              {/* Author */}
              <div className="pt-4 border-t border-slate-200/80 flex items-center gap-3">
                <div className="relative w-11 h-11 rounded-full overflow-hidden border border-slate-200 shrink-0 bg-slate-200">
                  <Image
                    src={test.image}
                    alt={test.studentName}
                    fill
                    sizes="44px"
                    className="object-cover object-top"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-theme-navy truncate">
                    {test.studentName}
                  </h4>
                  <p className="text-[11px] text-slate-500 truncate">
                    {test.studentRole}
                  </p>
                  <span className="text-[10px] text-theme-primary font-medium">
                    {test.courseOrClass}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
