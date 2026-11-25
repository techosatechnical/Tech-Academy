'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useOrganisation } from '@/context/OrganisationContext';
import { PageHeader } from '@/components/layout/PageHeader';
import { SectionTitle } from '@/components/ui/SectionTitle';
import {
  Compass,
  Eye,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export default function OrgAboutPage() {
  const { aboutPage, organisation, basePath } = useOrganisation();

  return (
    <>
      {/* Page Banner */}
      <PageHeader
        title={aboutPage.title}
        subtitle={aboutPage.subtitle}
        breadcrumbs={[{ label: 'About Us' }]}
      />

      {/* 1. Introduction & Institution Overview */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-theme-primary bg-theme-light px-3 py-1 rounded-full border border-theme-primary/20 inline-block">
                Institution Overview
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-theme-navy tracking-tight leading-tight">
                {aboutPage.overviewHeading}
              </h2>
              <p className="text-slate-600 text-base leading-relaxed">
                {aboutPage.overviewText1}
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                {aboutPage.overviewText2}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                {aboutPage.stats.map((stat, idx) => (
                  <div key={idx} className="p-3 bg-theme-surface rounded-lg border border-slate-200">
                    <div className="text-2xl font-black text-theme-primary">{stat.value}</div>
                    <div className="text-xs text-slate-600 font-semibold mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative h-[420px] rounded-2xl overflow-hidden shadow-xl border-4 border-slate-100">
                <Image
                  src={aboutPage.imageUrl}
                  alt="Students engaged in laboratory and classroom learning"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Mission & Vision */}
      <section className="py-16 sm:py-20 bg-theme-surface border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle="Guiding Principles"
            title="Our Mission & Institutional Vision"
            description="The core beacons that steer every lecture, test series, and student consultation."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-slate-300 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-theme-light border border-theme-primary/20 flex items-center justify-center text-theme-primary mb-5">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-theme-navy mb-3">
                Our Mission
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                {aboutPage.mission}
              </p>
              <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                {aboutPage.missionPoints.map((pt, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Vision */}
            <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-slate-300 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-theme-light border border-theme-primary/20 flex items-center justify-center text-theme-primary mb-5">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-theme-navy mb-3">
                Our Vision
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                {aboutPage.vision}
              </p>
              <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                {aboutPage.visionPoints.map((pt, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Teaching Methodology */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle="Pedagogy & Approach"
            title="Our Four-Stage Teaching Methodology"
            description="A time-tested systematic framework that turns confusion into clarity and anxiety into mastery."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {aboutPage.methodology.map((method, idx) => (
              <div
                key={idx}
                className="bg-theme-surface rounded-xl p-6 border border-slate-200 relative group hover:border-slate-300 hover:bg-white transition-all shadow-xs"
              >
                <div className="text-3xl font-black text-theme-primary/20 group-hover:text-theme-primary transition-colors mb-3">
                  {method.step}
                </div>
                <h3 className="text-base font-bold text-theme-navy mb-2">
                  {method.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {method.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Educational Values & Why Students Should Choose Us */}
      <section className="py-16 sm:py-20 bg-theme-surface border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-theme-primary bg-theme-light px-3 py-1 rounded-full border border-theme-primary/20 inline-block">
                Institutional Values
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-theme-navy tracking-tight">
                Our Educational Values
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {aboutPage.educationalValues.map((val, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-lg border border-slate-200">
                    <h4 className="text-sm font-bold text-theme-navy mb-1">{val.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{val.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-2xl font-bold text-theme-navy">
                Why Students Should Choose {organisation.name}
              </h3>
              <ul className="space-y-3.5 text-xs sm:text-sm text-slate-700">
                {aboutPage.whyChooseUsPoints.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-theme-primary shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-4">
                <Link
                  href={`${basePath}/courses`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-theme-primary text-white text-xs sm:text-sm font-bold hover:opacity-90 transition-opacity"
                >
                  <span>Explore Courses</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href={`${basePath}/admission`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-slate-300 text-slate-700 text-xs sm:text-sm font-bold hover:bg-slate-50 transition-colors"
                >
                  Admission Enquiry
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
