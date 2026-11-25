import React from 'react';
import { Hero } from '@/components/home/Hero';
import { AnnouncementsBanner } from '@/components/home/AnnouncementsBanner';
import { AboutPreview } from '@/components/home/AboutPreview';
import { Features } from '@/components/home/Features';
import { PopularCourses } from '@/components/home/PopularCourses';
import { AcademicStats } from '@/components/home/AcademicStats';
import { FacultyPreview } from '@/components/home/FacultyPreview';
import { Testimonials } from '@/components/home/Testimonials';
import { GalleryGrid } from '@/components/gallery/GalleryGrid';
import { AdmissionCTA } from '@/components/home/AdmissionCTA';

export default function OrgHomePage() {
  return (
    <>
      <AnnouncementsBanner />
      <Hero />
      <AboutPreview />
      <Features />
      <PopularCourses />
      <AcademicStats />
      <FacultyPreview />
      <Testimonials />
      <GalleryGrid />
      <AdmissionCTA />
    </>
  );
}
