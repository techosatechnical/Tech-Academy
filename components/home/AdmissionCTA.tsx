'use client';

import React from 'react';
import Link from 'next/link';
import { useOrganisation } from '@/context/OrganisationContext';
import { ArrowRight, Phone, CheckCircle2, Calendar } from 'lucide-react';

export const AdmissionCTA: React.FC = () => {
  const { organisation, settings, basePath } = useOrganisation();

  return (
    <section className="bg-theme-navy text-white py-16 sm:py-20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold">
              <Calendar className="w-3.5 h-3.5 text-white/80" />
              Admissions Open for {settings.academicYear} Academic Session
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Give Your Child the {organisation.name} Advantage
            </h2>
            <p className="text-base sm:text-lg text-slate-200 max-w-2xl leading-relaxed">
              Batches are intentionally restricted to 15–20 seats per class to preserve high academic standards and individualized student focus. Register early to reserve your preferred schedule.
            </p>
            <div className="flex flex-wrap gap-y-2 gap-x-6 text-xs sm:text-sm text-slate-300 pt-2">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Free Academic Diagnostic Test
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Comprehensive Study Modules Included
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Saturday Doubt Clarification
              </span>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4">
            <Link
              href={`${basePath}/admission`}
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-md bg-white text-slate-900 text-base font-bold hover:bg-slate-100 shadow-lg transition-all duration-200 gap-2 text-center"
            >
              <span>Apply for Admission</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href={`${basePath}/contact`}
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-md bg-white/10 border border-white/20 text-white text-base font-bold hover:bg-white/20 transition-all duration-200 gap-2 text-center"
            >
              <Phone className="w-4 h-4 text-white/80" />
              <span>Contact Campus Desk</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
