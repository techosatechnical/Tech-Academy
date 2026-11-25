'use client';

import React from 'react';
import Link from 'next/link';
import { useOrganisation } from '@/context/OrganisationContext';
import { FacultyCard } from '@/components/faculty/FacultyCard';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ArrowRight } from 'lucide-react';

export const FacultyPreview: React.FC = () => {
  const { teachers, organisation, basePath } = useOrganisation();
  const featuredFaculty = teachers.slice(0, 4);

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-theme-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          subtitle="Experienced Educators"
          title={`Meet Our Distinguished Faculty at ${organisation.name}`}
          description="Subject experts dedicated to fostering academic excellence, critical thinking, and student success."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {featuredFaculty.map((member) => (
            <FacultyCard key={member.id} faculty={member} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href={`${basePath}/faculty`}
            className="inline-flex items-center justify-center px-7 py-3 text-sm font-bold rounded-md bg-theme-primary text-white hover:opacity-90 shadow-sm hover:shadow transition-all duration-200 gap-2"
          >
            <span>Meet All Faculty Members</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
