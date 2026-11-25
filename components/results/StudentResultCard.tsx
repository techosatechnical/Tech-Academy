'use client';

import React from 'react';
import Image from 'next/image';
import { StudentResult } from '@/types';
import { Award, Trophy, Calendar } from 'lucide-react';

interface StudentResultCardProps {
  result: StudentResult;
}

export const StudentResultCard: React.FC<StudentResultCardProps> = ({ result }) => {
  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group hover:border-slate-300">
      {/* Top Banner Accent */}
      <div className="h-2 bg-theme-primary" />

      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Top Row: Photo + Score Badge */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-theme-primary/20 shrink-0 bg-slate-100 shadow-xs">
              <Image
                src={result.image}
                alt={result.studentName}
                fill
                sizes="64px"
                className="object-cover object-top"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-theme-navy truncate group-hover:text-theme-primary transition-colors">
                {result.studentName}
              </h3>
              <p className="text-xs text-slate-500 font-medium truncate">
                {result.classLevel}
              </p>
              {result.percentileOrRank && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-1 border border-emerald-200">
                  <Trophy className="w-3 h-3 text-emerald-600 shrink-0" />
                  {result.percentileOrRank}
                </span>
              )}
            </div>
          </div>

          {/* Exam & Score Details */}
          <div className="bg-theme-light rounded-md p-3 mb-3 border border-theme-primary/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-theme-primary tracking-wider block">
                {result.examination}
              </span>
              <span className="text-xs text-slate-600 font-medium">Score Achieved</span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-extrabold text-theme-primary tracking-tight">
                {result.score}
              </span>
            </div>
          </div>

          {/* Achievement Highlights */}
          <p className="text-xs text-slate-600 leading-relaxed italic border-l-2 border-theme-primary/40 pl-2.5 my-2">
            &quot;{result.achievementHighlight}&quot;
          </p>
        </div>

        {/* Footer info: Year & Stream */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 mt-2">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            Session: {result.academicYear}
          </span>
          {result.stream && (
            <span className="flex items-center gap-1 font-medium text-slate-700">
              <Award className="w-3.5 h-3.5 text-theme-primary" />
              {result.stream}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
