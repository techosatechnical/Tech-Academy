'use client';

import React, { Suspense } from 'react';
import { useOrganisation } from '@/context/OrganisationContext';
import { PageHeader } from '@/components/layout/PageHeader';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { AdmissionForm } from '@/components/forms/AdmissionForm';
import { FAQAccordion } from '@/components/admission/FAQAccordion';
import {
  FileCheck2,
  Calendar,
  CheckCircle,
  ClipboardList,
} from 'lucide-react';

const admissionSteps = [
  {
    step: '1',
    title: 'Submit Online Enquiry',
    desc: 'Fill out the candidate profile and select your preferred class batch or course subjects.',
  },
  {
    step: '2',
    title: 'Diagnostic Counseling',
    desc: 'Attend a short 20-minute diagnostic session with our academic mentors to identify learning goals.',
  },
  {
    step: '3',
    title: 'Batch Allotment',
    desc: 'Choose from suitable morning or evening batches based on school timings and stream requirements.',
  },
  {
    step: '4',
    title: 'Kit Handover & Orientation',
    desc: 'Receive comprehensive printed course modules, student ID card, schedule timetable, and begin classes.',
  },
];

const eligibilityCriteria = [
  {
    level: 'Secondary School Batches',
    criteria: 'Students currently enrolled in recognized schools (CBSE, ICSE, or State Board). Open admission subject to batch capacity.',
  },
  {
    level: 'Class 10 Board Master Series',
    criteria: 'Minimum passing marks in preceding annual examinations. Diagnostic assessment used strictly for remedial grouping.',
  },
  {
    level: 'Senior Secondary (Plus One & Plus Two)',
    criteria: 'Candidates must have completed Class 10 with Mathematics & Science (for Science stream) or Mathematics/Social Science (for Commerce stream).',
  },
  {
    level: 'Competitive Batches (JEE / NEET)',
    criteria: 'Enrolled in Senior Secondary Science stream with a dedication to attending weekly intensive problem-solving workshops.',
  },
];

const requiredDocuments = [
  'Copy of latest school mark sheet / progress card from previous term',
  'Two recent passport-sized color photographs of the student',
  'Copy of valid identity or school ID card',
  'Completed and signed Student Registration Form',
  'Parent / Guardian contact and emergency details verification',
];

export default function OrgAdmissionPage() {
  const { organisation, settings, faqs } = useOrganisation();

  return (
    <>
      <PageHeader
        title="Admission & Enrollment"
        subtitle={`Begin your journey towards academic mastery. Applications open for Academic Session ${settings.academicYear} at ${organisation.name}.`}
        breadcrumbs={[{ label: 'Admission' }]}
      />

      <section className="py-12 sm:py-16 bg-theme-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Introduction Alert Banner */}
          <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-xs mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-theme-primary bg-theme-light px-3 py-1 rounded-full border border-theme-primary/20 inline-block">
                  Admission Policy
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-theme-navy">
                  Merit, Mentorship & Micro-Batch Focus
                </h2>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {organisation.name} admissions operate on an inclusive, student-centric principle. Rather
                  than screening candidates out through intimidating entrance cutoffs, we believe in
                  identifying where a student currently stands, resolving fundamental gaps patiently,
                  and elevating them to top-tier academic confidence.
                </p>
              </div>
              <div className="lg:col-span-4 bg-theme-light border border-theme-primary/20 rounded-lg p-5">
                <h4 className="text-xs font-bold uppercase text-slate-800 tracking-wider mb-2 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-theme-primary" />
                  Important Admission Dates
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  <li>• Early Bird Registration: Ongoing</li>
                  <li>• Diagnostic Evaluation Batches: Every Saturday</li>
                  <li>• Regular Batches Commencement: 1st Week of June</li>
                  <li>• Crash Revision Modules: Year-round enrollment</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Admission Procedure */}
          <div className="mb-16">
            <SectionTitle
              subtitle="Step-by-Step"
              title="Admission Procedure"
              description="A clear, hassle-free 4-step onboarding process for parents and candidates."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {admissionSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs relative group hover:border-slate-300 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-theme-primary text-white flex items-center justify-center font-bold text-sm mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-base font-bold text-theme-navy mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Eligibility & Required Documents Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            {/* Eligibility */}
            <div className="lg:col-span-7 bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-xs">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-theme-light border border-theme-primary/20 flex items-center justify-center text-theme-primary">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-theme-navy">Eligibility Criteria</h3>
                  <p className="text-xs text-slate-500">Program-wise prerequisite requirements</p>
                </div>
              </div>

              <div className="space-y-4">
                {eligibilityCriteria.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-theme-surface border border-slate-200">
                    <h4 className="text-sm font-bold text-theme-primary mb-1">{item.level}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.criteria}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Required Documents */}
            <div className="lg:col-span-5 bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-theme-light border border-theme-primary/20 flex items-center justify-center text-theme-primary">
                    <FileCheck2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-theme-navy">Required Documents</h3>
                    <p className="text-xs text-slate-500">Checklist to bring during offline verification</p>
                  </div>
                </div>

                <ul className="space-y-3">
                  {requiredDocuments.map((doc, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 bg-slate-50 rounded-lg p-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Note:</strong> Original certificates are verified at the campus desk and returned immediately. We retain only self-attested photocopies.
                </p>
              </div>
            </div>
          </div>

          {/* Form & FAQ Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
            {/* Enquiry Form */}
            <div className="lg:col-span-7">
              <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading form...</div>}>
                <AdmissionForm />
              </Suspense>
            </div>

            {/* FAQs Accordion */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-theme-primary bg-theme-light px-3 py-1 rounded-full border border-theme-primary/20 inline-block mb-2">
                  Have Questions?
                </span>
                <h3 className="text-2xl font-bold text-theme-navy">
                  Frequently Asked Questions
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Answers to common questions regarding admissions, batch allocations, and class formats at {organisation.name}.
                </p>
              </div>

              <FAQAccordion items={faqs} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
