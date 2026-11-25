'use client';

import React from 'react';
import Link from 'next/link';
import { useOrganisation } from '@/context/OrganisationContext';
import { CourseCard } from '@/components/courses/CourseCard';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ArrowRight } from 'lucide-react';

export const PopularCourses: React.FC = () => {
  const { courses, basePath } = useOrganisation();
  const displayedCourses = courses.slice(0, 4);

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          subtitle="Academic Programs"
          title="Popular Courses & Coaching Batches"
          description="Tailored curricula designed for school board triumph and competitive entrance preparedness."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {displayedCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href={`${basePath}/courses`}
            className="inline-flex items-center justify-center px-7 py-3 text-sm font-bold rounded-md bg-theme-primary text-white hover:opacity-90 shadow-sm hover:shadow transition-all duration-200 gap-2"
          >
            <span>View All Courses & Programs</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
