'use client';

import React, { useState } from 'react';
import { useOrganisation } from '@/context/OrganisationContext';
import { CourseCard } from '@/components/courses/CourseCard';
import { PageHeader } from '@/components/layout/PageHeader';
import { BookOpen, GraduationCap, Clock, Award } from 'lucide-react';
import Link from 'next/link';

const categories = [
  { id: 'all', label: 'All Programs' },
  { id: 'school', label: 'Classes 5–10 School' },
  { id: 'higher-secondary', label: 'Plus One & Plus Two (+1 / +2)' },
  { id: 'specialized', label: 'Specialized Mastery' },
  { id: 'entrance', label: 'Competitive Entrance' },
];

export default function OrgCoursesPage() {
  const { courses, organisation, basePath } = useOrganisation();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredCourses =
    selectedCategory === 'all'
      ? courses
      : courses.filter((c) => c.category === selectedCategory);

  return (
    <>
      <PageHeader
        title="Courses & Academic Batches"
        subtitle={`Meticulously crafted coaching programs at ${organisation.name} for school boards and competitive entrance.`}
        breadcrumbs={[{ label: 'Courses' }]}
      />

      <section className="py-12 sm:py-16 bg-theme-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Quick Info Strip */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs mb-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs text-slate-600">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-theme-light border border-theme-primary/20 flex items-center justify-center text-theme-primary shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">State, CBSE & ICSE</h4>
                  <p>Curricula tailored per board criteria</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-theme-light border border-theme-primary/20 flex items-center justify-center text-theme-primary shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Flexible Batches</h4>
                  <p>Morning and evening batches available</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-theme-light border border-theme-primary/20 flex items-center justify-center text-theme-primary shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Complete Study Kits</h4>
                  <p>Printed notes & question banks included</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-theme-light border border-theme-primary/20 flex items-center justify-center text-theme-primary shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Mock Pre-Boards</h4>
                  <p>Timed evaluations with feedback</p>
                </div>
              </div>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center justify-center sm:justify-start gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-md text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-theme-primary text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          {/* Need help deciding box */}
          <div className="mt-16 bg-theme-navy text-white rounded-xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Academic Counseling Desk
              </span>
              <h3 className="text-2xl font-bold text-white mt-1 mb-2">
                Need guidance choosing the right batch at {organisation.name}?
              </h3>
              <p className="text-sm text-slate-200">
                Our academic counselors will evaluate your syllabus requirements, current standing, and college aspirations to recommend the ideal coaching schedule.
              </p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <Link
                href={`${basePath}/admission`}
                className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-theme-secondary hover:opacity-90 text-white font-bold text-sm shadow-md transition-opacity"
              >
                Request Counseling
              </Link>
              <Link
                href={`${basePath}/contact`}
                className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-colors"
              >
                Visit Campus
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
