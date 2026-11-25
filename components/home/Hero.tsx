'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useOrganisation } from '@/context/OrganisationContext';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export const Hero: React.FC = () => {
  const { homePage, basePath } = useOrganisation();

  return (
    <section className="relative bg-theme-navy text-white overflow-hidden">
      {/* Background Hero Image with Academic Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={homePage.heroImageUrl}
          alt="Students studying together in educational classroom"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-20 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-theme-navy via-theme-navy/95 to-black/70" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 md:py-32 lg:py-36">
        <div className="max-w-3xl">
          {/* Institution Credential Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs sm:text-sm font-semibold mb-6 backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            {homePage.heroBadge}
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            {homePage.heroHeading} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/70">
              {homePage.heroHeadingAccent}
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="text-lg sm:text-xl text-slate-200 leading-relaxed mb-8 max-w-2xl font-normal">
            {homePage.heroSubheading}
          </p>

          {/* Two CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-12">
            <Link
              href={`${basePath}/courses`}
              className="inline-flex items-center justify-center px-7 py-3.5 text-base font-bold rounded-md bg-theme-secondary text-white hover:opacity-90 shadow-md hover:shadow-lg transition-all duration-200 gap-2 text-center"
            >
              <span>Explore Courses</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href={`${basePath}/admission`}
              className="inline-flex items-center justify-center px-7 py-3.5 text-base font-bold rounded-md bg-white text-slate-900 hover:bg-slate-100 shadow-md hover:shadow-lg transition-all duration-200 text-center"
            >
              Apply Now
            </Link>
          </div>

          {/* Quick Credibility Checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-white/20">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Expert & Qualified Faculty</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Small Batch Sizes (Max 20)</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Proven Academic Results</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Bottom Metric Strip */}
      <div className="relative z-10 bg-black/40 border-t border-white/10 backdrop-blur-xs py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {homePage.stats.map((stat, idx) => (
              <div key={idx} className="p-2">
                <div className="text-2xl sm:text-3xl font-extrabold text-white">{stat.value}</div>
                <div className="text-xs text-slate-300 font-medium uppercase tracking-wider mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
