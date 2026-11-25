'use client';

import React from 'react';
import Image from 'next/image';
import { FacultyMember } from '@/types';
import { useOrganisation } from '@/context/OrganisationContext';
import { Award, Briefcase, GraduationCap } from 'lucide-react';

interface FacultyCardProps {
  faculty: FacultyMember;
}

export const FacultyCard: React.FC<FacultyCardProps> = ({ faculty }) => {
  const { organisation } = useOrganisation();

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group hover:border-slate-300">
      {/* Teacher Photo */}
      <div className="relative w-full h-64 bg-slate-100 overflow-hidden">
        <Image
          src={faculty.image}
          alt={faculty.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
        <div className="absolute bottom-3 left-4 right-4 text-white">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-white bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs inline-block mb-1">
            {faculty.subject}
          </span>
          <h3 className="text-lg font-bold leading-tight">{faculty.name}</h3>
        </div>
      </div>

      {/* Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          {/* Designation & Qualification */}
          <div className="space-y-1.5">
            <div className="flex items-start gap-2 text-xs font-semibold text-slate-700">
              <GraduationCap className="w-4 h-4 text-theme-primary shrink-0 mt-0.5" />
              <span>{faculty.qualification}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Briefcase className="w-4 h-4 text-theme-primary shrink-0" />
              <span>
                <strong className="text-slate-800">{faculty.experienceYears}+ Years</strong> of Teaching Experience
              </span>
            </div>
            {faculty.specialization && (
              <div className="flex items-start gap-2 text-xs text-slate-600">
                <Award className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-slate-600 italic">Specialization: {faculty.specialization}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
            {faculty.description}
          </p>
        </div>

        {/* Footer info badge */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>{faculty.designation}</span>
          <span className="text-theme-primary font-semibold">{organisation.name}</span>
        </div>
      </div>
    </div>
  );
};
