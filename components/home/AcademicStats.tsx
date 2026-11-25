'use client';

import React from 'react';
import Link from 'next/link';
import { useOrganisation } from '@/context/OrganisationContext';
import { Trophy, ArrowRight } from 'lucide-react';

export const AcademicStats: React.FC = () => {
  const { organisation, results, basePath } = useOrganisation();

  const stats = [
    { value: '98.6%', label: 'Top Score (State / Board)', description: 'Highest score recorded in recent examinations' },
    { value: '180+', label: 'Distinction Achievers', description: 'Scored 90% and above in Board Examinations' },
    { value: '100%', label: 'Pass Rate Consistency', description: 'Consecutive track record across batches' },
    { value: '45+', label: 'Competitive Ranks', description: 'Students qualifying in top entrance rankings' },
  ];

  const topStudent = results[0];

  return (
    <section className="py-16 sm:py-20 bg-theme-navy text-white relative overflow-hidden">
      {/* Decorative background grid */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block text-xs font-bold tracking-widest uppercase mb-2 px-3 py-1 rounded-full bg-white/10 text-white border border-white/20">
            Our Track Record
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Academic Achievements & Proven Results
          </h2>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
            Consistently leading student success year after year through disciplined practice,
            clarity of thought, and relentless dedication from our mentors at {organisation.name}.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white/10 border border-white/15 rounded-xl p-6 text-center hover:bg-white/15 transition-colors backdrop-blur-xs"
            >
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-2">
                {stat.value}
              </div>
              <h3 className="text-sm font-bold text-white mb-1">
                {stat.label}
              </h3>
              <p className="text-xs text-slate-300">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        {/* Highlight Banner */}
        <div className="bg-black/30 border border-white/20 rounded-xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
              <Trophy className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">
                Celebrating Our High Scorers & Rank Holders
              </h4>
              <p className="text-xs sm:text-sm text-slate-300">
                {topStudent
                  ? `Featured Achiever: ${topStudent.studentName} (${topStudent.score}) – ${topStudent.achievementHighlight}`
                  : 'Explore individual rank lists, subject centum holders, and admission stories.'}
              </p>
            </div>
          </div>
          <Link
            href={`${basePath}/results`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-white text-slate-900 text-sm font-bold hover:bg-slate-100 transition-colors shadow-sm shrink-0"
          >
            <span>View Hall of Fame</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
