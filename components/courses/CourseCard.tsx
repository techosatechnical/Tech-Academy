'use client';

import React from 'react';
import Link from 'next/link';
import { Course } from '@/types';
import { useOrganisation } from '@/context/OrganisationContext';
import { BookOpen, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

interface CourseCardProps {
  course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const { basePath } = useOrganisation();

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:border-slate-300">
      <div>
        {/* Header / Level Badge */}
        <div className="p-6 border-b border-slate-100 bg-theme-surface">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-theme-primary bg-theme-light px-2.5 py-1 rounded border border-theme-primary/20">
              {course.level}
            </span>
            {course.isPopular && (
              <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                Popular Batch
              </span>
            )}
          </div>
          <h3 className="text-xl font-bold text-theme-navy group-hover:text-theme-primary transition-colors leading-snug">
            {course.title}
          </h3>
          <p className="text-xs font-medium text-slate-500 mt-1">
            Target: {course.classGroup}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-600 leading-relaxed">
            {course.shortDescription}
          </p>

          {/* Subjects list */}
          <div>
            <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-2 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-theme-primary" />
              Subjects Covered
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {course.subjects.map((subj, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium"
                >
                  {subj}
                </span>
              ))}
            </div>
          </div>

          {/* Highlights */}
          {course.highlights && course.highlights.length > 0 && (
            <div className="pt-2 border-t border-slate-100">
              <ul className="space-y-1.5">
                {course.highlights.slice(0, 3).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Timing & Duration */}
          <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
            <Clock className="w-3.5 h-3.5 text-theme-primary shrink-0" />
            <span className="truncate">{course.batchTiming}</span>
          </div>
        </div>
      </div>

      {/* Footer Action */}
      <div className="p-6 pt-0 bg-white">
        <div className="flex items-center gap-3">
          <Link
            href={`${basePath}/admission?course=${encodeURIComponent(course.title)}`}
            className="flex-1 inline-flex items-center justify-center py-2 px-3 text-xs sm:text-sm font-semibold rounded bg-theme-primary text-white hover:opacity-90 transition-opacity gap-1.5 group/btn"
          >
            <span>Enquire Now</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            href={`${basePath}/contact?subject=${encodeURIComponent(`Query regarding ${course.title}`)}`}
            className="inline-flex items-center justify-center py-2 px-3 text-xs sm:text-sm font-semibold rounded border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};
