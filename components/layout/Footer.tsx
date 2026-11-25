'use client';

import React from 'react';
import Link from 'next/link';
import { useOrganisation } from '@/context/OrganisationContext';
import {
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowUp,
  ShieldCheck,
  Award,
} from 'lucide-react';
import {
  FacebookIcon,
  InstagramIcon,
  YouTubeIcon,
  LinkedInIcon,
} from '@/components/ui/SocialIcons';

export const Footer: React.FC = () => {
  const { organisation, courses, basePath } = useOrganisation();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="bg-theme-navy text-slate-300 border-t-4 border-theme-primary">
      {/* Top Banner Feature Ribbon */}
      <div className="bg-black/30 py-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Recognized Academic Excellence</p>
                <p className="text-xs text-slate-300">Consistent board rank holders & distinctions</p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Dedicated Faculty Mentorship</p>
                <p className="text-xs text-slate-300">Experienced educators with proven pedagogy</p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Small Batch Attention</p>
                <p className="text-xs text-slate-300">Personalized attention for every learner</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Institution Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-theme-primary flex items-center justify-center text-white">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-extrabold text-white tracking-tight block">
                  {organisation.name.toUpperCase()}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-white/80 font-semibold block">
                  {organisation.tagline}
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {organisation.name} is a premier educational tuition and coaching institution dedicated to academic
              excellence, conceptual clarity, and empowering secondary and higher secondary
              students to realize their highest academic potential.
            </p>
            {organisation.socialLinks && (
              <div className="flex items-center gap-3 pt-2">
                {organisation.socialLinks.facebook && (
                  <a
                    href={organisation.socialLinks.facebook}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Facebook"
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-theme-primary flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                  >
                    <FacebookIcon className="w-4 h-4" />
                  </a>
                )}
                {organisation.socialLinks.instagram && (
                  <a
                    href={organisation.socialLinks.instagram}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram"
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-theme-primary flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                  >
                    <InstagramIcon className="w-4 h-4" />
                  </a>
                )}
                {organisation.socialLinks.youtube && (
                  <a
                    href={organisation.socialLinks.youtube}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="YouTube"
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-theme-primary flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                  >
                    <YouTubeIcon className="w-4 h-4" />
                  </a>
                )}
                {organisation.socialLinks.linkedin && (
                  <a
                    href={organisation.socialLinks.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn"
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-theme-primary flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                  >
                    <LinkedInIcon className="w-4 h-4" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-white/20 pb-2">
              Quick Navigation
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href={basePath || '/'} className="hover:text-white transition-colors inline-block py-0.5">
                  Home
                </Link>
              </li>
              <li>
                <Link href={`${basePath}/about`} className="hover:text-white transition-colors inline-block py-0.5">
                  About Academy
                </Link>
              </li>
              <li>
                <Link href={`${basePath}/courses`} className="hover:text-white transition-colors inline-block py-0.5">
                  Courses & Batches
                </Link>
              </li>
              <li>
                <Link href={`${basePath}/faculty`} className="hover:text-white transition-colors inline-block py-0.5">
                  Distinguished Faculty
                </Link>
              </li>
              <li>
                <Link href={`${basePath}/admission`} className="hover:text-white transition-colors inline-block py-0.5">
                  Admission Procedure
                </Link>
              </li>
              <li>
                <Link href={`${basePath}/results`} className="hover:text-white transition-colors inline-block py-0.5">
                  Academic Results & Toppers
                </Link>
              </li>
              <li>
                <Link href={`${basePath}/gallery`} className="hover:text-white transition-colors inline-block py-0.5">
                  Campus Gallery
                </Link>
              </li>
              <li>
                <Link href={`${basePath}/contact`} className="hover:text-white transition-colors inline-block py-0.5">
                  Contact & Campus Location
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Courses */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-white/20 pb-2">
              Academic Programs
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              {courses.slice(0, 5).map((course) => (
                <li key={course.id}>
                  <Link
                    href={`${basePath}/admission?course=${encodeURIComponent(course.title)}`}
                    className="hover:text-white transition-colors inline-block py-0.5 truncate max-w-full"
                  >
                    {course.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-white/20 pb-2">
              Academy Office
            </h3>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-white/80 mt-0.5 shrink-0" />
                <span className="leading-snug">
                  {organisation.contact.address}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-white/80 shrink-0" />
                <a href={`tel:${organisation.contact.phone.replace(/\s+/g, '')}`} className="hover:text-white transition-colors">
                  {organisation.contact.phone} {organisation.contact.altPhone && `/ ${organisation.contact.altPhone}`}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-white/80 shrink-0" />
                <a href={`mailto:${organisation.contact.email}`} className="hover:text-white transition-colors">
                  {organisation.contact.email}
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-white/80 mt-0.5 shrink-0" />
                <div>
                  <p>{organisation.contact.workingHours}</p>
                  {organisation.contact.sundayHours && (
                    <p className="text-slate-400">{organisation.contact.sundayHours}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar & Copyright */}
        <div className="pt-8 mt-12 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            &copy; {new Date().getFullYear()} {organisation.name.toUpperCase()}. All rights reserved. Professional Academic Tuition Centre.
          </p>

          <div className="flex items-center gap-6">
            <span>Tagline: &quot;{organisation.tagline}&quot;</span>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/10 hover:bg-theme-primary text-white transition-colors cursor-pointer"
              aria-label="Back to top"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
