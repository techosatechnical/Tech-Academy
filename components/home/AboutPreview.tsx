'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useOrganisation } from '@/context/OrganisationContext';
import { ArrowRight, ShieldCheck, Target, HeartHandshake } from 'lucide-react';

export const AboutPreview: React.FC = () => {
  const { homePage, basePath } = useOrganisation();
  const { aboutPreview } = homePage;

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column: Image with Academic Badge */}
          <div className="relative">
            <div className="relative h-[380px] sm:h-[460px] rounded-2xl overflow-hidden shadow-lg border-4 border-slate-100">
              <Image
                src={aboutPreview.imageUrl}
                alt="Teacher explaining concepts to attentive students in classroom"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            {/* Overlaid Institutional Highlight Card */}
            <div className="absolute -bottom-6 -right-2 sm:right-6 bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xl max-w-xs sm:max-w-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-theme-light border border-theme-primary/20 flex items-center justify-center text-theme-primary shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {aboutPreview.cardTitle}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {aboutPreview.cardDescription}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative & Values */}
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-theme-primary bg-theme-light px-3 py-1 rounded-full border border-theme-primary/20 inline-block mb-3">
                {aboutPreview.badge}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-theme-navy tracking-tight leading-tight">
                {aboutPreview.heading}
              </h2>
            </div>

            <p className="text-slate-600 text-base leading-relaxed">
              {aboutPreview.text1}
            </p>

            <p className="text-slate-600 text-sm leading-relaxed">
              {aboutPreview.text2}
            </p>

            {/* Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {aboutPreview.pillars.map((pillar, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-theme-surface border border-slate-200/80">
                  {idx === 0 ? (
                    <Target className="w-5 h-5 text-theme-primary mt-0.5 shrink-0" />
                  ) : (
                    <HeartHandshake className="w-5 h-5 text-theme-primary mt-0.5 shrink-0" />
                  )}
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase">{pillar.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{pillar.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link
                href={`${basePath}/about`}
                className="inline-flex items-center gap-2 text-sm font-bold text-theme-primary hover:opacity-80 group"
              >
                <span>Read Full Academy Overview & Educational Philosophy</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
