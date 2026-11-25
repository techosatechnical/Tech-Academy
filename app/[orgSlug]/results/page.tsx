'use client';

import React, { useState } from 'react';
import { useOrganisation } from '@/context/OrganisationContext';
import { StudentResultCard } from '@/components/results/StudentResultCard';
import { PageHeader } from '@/components/layout/PageHeader';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Trophy, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function OrgResultsPage() {
  const { results, organisation, basePath } = useOrganisation();
  const [selectedStream, setSelectedStream] = useState('all');

  const filterStreams = [
    { id: 'all', label: 'All Achievers' },
    { id: 'Science', label: 'Science / Medical' },
    { id: 'Engineering', label: 'Engineering / JEE' },
    { id: 'Commerce', label: 'Commerce' },
  ];

  const filteredResults =
    selectedStream === 'all'
      ? results
      : results.filter((res) => {
          if (selectedStream === 'Science') {
            return res.stream?.toLowerCase().includes('science') || res.stream?.toLowerCase().includes('medical');
          }
          if (selectedStream === 'Engineering') {
            return res.stream?.toLowerCase().includes('engineering') || res.stream?.toLowerCase().includes('jee');
          }
          if (selectedStream === 'Commerce') {
            return res.stream?.toLowerCase().includes('commerce');
          }
          return true;
        });

  return (
    <>
      <PageHeader
        title="Academic Results & Hall of Fame"
        subtitle={`Celebrating the perseverance and stellar achievements of our students at ${organisation.name}.`}
        breadcrumbs={[{ label: 'Results' }]}
      />

      <section className="py-12 sm:py-16 bg-theme-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Organisation Banner */}
          <div className="mb-8 p-3 rounded-md bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <strong>{organisation.name} Hall of Fame:</strong> Verified achiever rankings across Board Examinations and National Entrances.
            </span>
            <span className="hidden sm:inline-block font-semibold">Session 2025–2026</span>
          </div>

          {/* Top-Performing Students Section Title */}
          <SectionTitle
            subtitle="Roll of Honor"
            title="Top-Performing Students & Rank Holders"
            description={`Exemplifying dedication, consistency, and disciplined learning under ${organisation.name} mentorship.`}
          />

          {/* Filter Pills */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-8">
            {filterStreams.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedStream(filter.id)}
                className={`px-4 py-2 rounded-md text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  selectedStream === filter.id
                    ? 'bg-theme-primary text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Student Result Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {filteredResults.map((result) => (
              <StudentResultCard key={result.id} result={result} />
            ))}
          </div>

          {/* Next Success Story CTA */}
          <div className="mt-16 bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center max-w-4xl mx-auto shadow-xs">
            <div className="w-14 h-14 bg-amber-50 rounded-full border border-amber-200 flex items-center justify-center mx-auto mb-4 text-amber-600">
              <Trophy className="w-7 h-7" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-theme-navy mb-3">
              Be the Next {organisation.name} Success Story
            </h3>
            <p className="text-sm text-slate-600 max-w-2xl mx-auto mb-6 leading-relaxed">
              Whether your ambition is securing 95%+ in school board finals or gaining top ranks in competitive examinations, {organisation.name} provides the mentorship, study modules, and atmosphere to make it a reality.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href={`${basePath}/admission`}
                className="inline-flex items-center justify-center px-7 py-3 rounded-md bg-theme-primary text-white text-sm font-bold hover:opacity-90 transition-opacity shadow-sm"
              >
                Apply for Next Batch
              </Link>
              <Link
                href={`${basePath}/courses`}
                className="inline-flex items-center justify-center px-7 py-3 rounded-md border border-slate-300 text-slate-700 text-sm font-bold hover:bg-slate-50 transition-colors"
              >
                Explore Batches
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
