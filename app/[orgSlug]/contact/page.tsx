'use client';

import React, { Suspense } from 'react';
import { useOrganisation } from '@/context/OrganisationContext';
import { PageHeader } from '@/components/layout/PageHeader';
import { ContactForm } from '@/components/forms/ContactForm';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Compass,
} from 'lucide-react';
import {
  FacebookIcon,
  InstagramIcon,
  YouTubeIcon,
  LinkedInIcon,
} from '@/components/ui/SocialIcons';

export default function OrgContactPage() {
  const { organisation } = useOrganisation();

  return (
    <>
      <PageHeader
        title={`Contact ${organisation.name}`}
        subtitle="Get in touch with our admissions office, request batch counseling, or plan a campus visit."
        breadcrumbs={[{ label: 'Contact' }]}
      />

      <section className="py-12 sm:py-16 bg-theme-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
            {/* Left Column: Contact Cards & Academy Information */}
            <div className="lg:col-span-5 space-y-6">
              {/* Institution Address */}
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-theme-light border border-theme-primary/20 flex items-center justify-center text-theme-primary shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-theme-navy mb-1">
                    Campus Address
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {organisation.contact.address}
                  </p>
                  {organisation.contact.landmark && (
                    <p className="text-[11px] text-theme-primary font-semibold mt-2">
                      Landmark: {organisation.contact.landmark}
                    </p>
                  )}
                </div>
              </div>

              {/* Phone Numbers */}
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-theme-light border border-theme-primary/20 flex items-center justify-center text-theme-primary shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-theme-navy mb-1">
                    Telephone & Admissions Desk
                  </h3>
                  <div className="space-y-1 text-xs sm:text-sm text-slate-600">
                    <p>
                      Main Admissions: <a href={`tel:${organisation.contact.phone.replace(/\s+/g, '')}`} className="text-theme-primary font-bold hover:underline">{organisation.contact.phone}</a>
                    </p>
                    {organisation.contact.altPhone && (
                      <p>
                        Alternate Line: <a href={`tel:${organisation.contact.altPhone.replace(/\s+/g, '')}`} className="text-theme-primary font-bold hover:underline">{organisation.contact.altPhone}</a>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Email Addresses */}
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-theme-light border border-theme-primary/20 flex items-center justify-center text-theme-primary shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-theme-navy mb-1">
                    Email Correspondence
                  </h3>
                  <div className="space-y-1 text-xs sm:text-sm text-slate-600">
                    <p>
                      Inquiries: <a href={`mailto:${organisation.contact.email}`} className="text-theme-primary font-medium hover:underline">{organisation.contact.email}</a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Working Hours */}
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-theme-light border border-theme-primary/20 flex items-center justify-center text-theme-primary shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-theme-navy mb-1">
                    Working & Campus Hours
                  </h3>
                  <div className="space-y-1.5 text-xs sm:text-sm text-slate-600">
                    <div className="flex justify-between border-b border-slate-100 pb-1">
                      <span>Working Hours:</span>
                      <strong className="text-slate-800">{organisation.contact.workingHours}</strong>
                    </div>
                    {organisation.contact.sundayHours && (
                      <div className="flex justify-between">
                        <span>Weekend Hours:</span>
                        <strong className="text-slate-800">{organisation.contact.sundayHours}</strong>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              {organisation.socialLinks && (
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
                  <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-3">
                    Connect on Social Channels
                  </h4>
                  <div className="flex items-center gap-3">
                    {organisation.socialLinks.facebook && (
                      <a
                        href={organisation.socialLinks.facebook}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Facebook"
                        className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-white hover:bg-theme-primary transition-colors"
                      >
                        <FacebookIcon className="w-5 h-5" />
                      </a>
                    )}
                    {organisation.socialLinks.instagram && (
                      <a
                        href={organisation.socialLinks.instagram}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Instagram"
                        className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-white hover:bg-theme-primary transition-colors"
                      >
                        <InstagramIcon className="w-5 h-5" />
                      </a>
                    )}
                    {organisation.socialLinks.youtube && (
                      <a
                        href={organisation.socialLinks.youtube}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="YouTube"
                        className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-white hover:bg-theme-primary transition-colors"
                      >
                        <YouTubeIcon className="w-5 h-5" />
                      </a>
                    )}
                    {organisation.socialLinks.linkedin && (
                      <a
                        href={organisation.socialLinks.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="LinkedIn"
                        className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-white hover:bg-theme-primary transition-colors"
                      >
                        <LinkedInIcon className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Contact Enquiry Form */}
            <div className="lg:col-span-7">
              <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading form...</div>}>
                <ContactForm />
              </Suspense>
            </div>
          </div>

          {/* Interactive Map Section Placeholder */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-6 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-theme-navy flex items-center gap-2">
                  <Compass className="w-5 h-5 text-theme-primary" />
                  {organisation.name} Campus Hub
                </h3>
                <p className="text-xs text-slate-500">
                  {organisation.contact.landmark || 'Centrally situated with convenient public transit connectivity.'}
                </p>
              </div>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-theme-primary hover:underline inline-flex items-center gap-1"
              >
                <span>Open in Google Maps</span>
              </a>
            </div>

            {/* Academic Map Simulation Graphic */}
            <div className="relative w-full h-80 sm:h-96 bg-slate-100 flex items-center justify-center p-6 text-center">
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#1E40AF_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="relative z-10 max-w-md bg-white/95 backdrop-blur-xs p-6 rounded-xl border border-slate-200 shadow-lg">
                <div className="w-12 h-12 bg-rose-50 border border-rose-200 rounded-full flex items-center justify-center mx-auto mb-3 text-rose-600">
                  <MapPin className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-theme-navy mb-1">
                  {organisation.name}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {organisation.contact.address}
                </p>
                <div className="inline-block px-3 py-1 rounded bg-theme-light border border-theme-primary/20 text-theme-primary text-xs font-semibold">
                  Visitor Parking Available On-Site
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
