'use client';

import React from 'react';
import Link from 'next/link';
import { useOrganisation } from '@/context/OrganisationContext';
import { FacultyCard } from '@/components/faculty/FacultyCard';
import { PageHeader } from '@/components/layout/PageHeader';
import { ShieldCheck, GraduationCap, HeartHandshake } from 'lucide-react';

export default function OrgFacultyPage() {
  const { teachers, organisation, basePath } = useOrganisation();

  return (
    <>
      <PageHeader
        title="Our Distinguished Faculty"
        subtitle={`Seasoned educators and subject specialists dedicated to student mastery at ${organisation.name}.`}
        breadcrumbs={[{ label: 'Faculty' }]}
      />

      <section className="py-12 sm:py-16 bg-theme-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Institutional Faculty Philosophy */}
          <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-xs mb-12">
            <div className="max-w-3xl mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-theme-primary bg-theme-light px-3 py-1 rounded-full border border-theme-primary/20 inline-block mb-2">
                Faculty Standards & Ethics
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-theme-navy">
                Mentors Who Teach with Passion, Patience & Precision
              </h2>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                At {organisation.name}, our teaching staff comprises highly qualified postgraduates and
                scholars with extensive classroom tenures. We emphasize student-first pedagogical
                patience, conceptual clarity, and systematic guidance for competitive examinations.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-theme-light border border-theme-primary/20 flex items-center justify-center text-theme-primary shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Advanced Qualifications</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Postgraduate, Ph.D. & certified subject educators.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-theme-light border border-theme-primary/20 flex items-center justify-center text-theme-primary shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Proven Experience</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Deep understanding of board marking schemes & exam strategies.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-theme-light border border-theme-primary/20 flex items-center justify-center text-theme-primary shrink-0">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Dedicated Doubt Clinics</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Available for 1-on-1 consultations and remedial sessions.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Faculty Members Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {teachers.map((faculty) => (
              <FacultyCard key={faculty.id} faculty={faculty} />
            ))}
          </div>

          {/* Join Our Learning Community CTA */}
          <div className="mt-16 text-center bg-white rounded-xl p-8 border border-slate-200 shadow-xs max-w-3xl mx-auto">
            <h3 className="text-xl font-bold text-theme-navy mb-2">
              Experience Our Faculty’s Teaching Firsthand
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-6">
              We welcome students and parents to attend an orientation session and interact directly with our lead department faculty before enrolling at {organisation.name}.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href={`${basePath}/admission`}
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-md bg-theme-primary text-white text-xs sm:text-sm font-bold hover:opacity-90 transition-opacity"
              >
                Schedule an Orientation
              </Link>
              <Link
                href={`${basePath}/contact`}
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-md border border-slate-300 text-slate-700 text-xs sm:text-sm font-bold hover:bg-slate-50 transition-colors"
              >
                Inquire Batch Timings
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
