'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useOrganisation } from '@/context/OrganisationContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  admissionFormSchema,
  AdmissionFormValues,
} from '@/lib/validations/enquiry';
import { submitAdmissionAction } from '@/app/actions/enquiry';
import {
  CheckCircle2,
  AlertCircle,
  Send,
  Loader2,
  Info,
  Calendar,
  FileCheck2,
  RotateCcw,
} from 'lucide-react';

export const AdmissionForm: React.FC = () => {
  const searchParams = useSearchParams();
  const initialCourse = searchParams.get('course') || '';
  const { organisation, courses, settings } = useOrganisation();

  const [submissionResult, setSubmissionResult] = useState<{
    success: boolean;
    referenceNumber?: string;
    studentName?: string;
    parentName?: string;
    courseName?: string;
  } | null>(null);

  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AdmissionFormValues>({
    resolver: zodResolver(admissionFormSchema),
    defaultValues: {
      studentName: '',
      parentName: '',
      phoneNumber: '',
      email: '',
      studentClass: '',
      preferredCourse: initialCourse,
      message: '',
      websiteUrl: '',
    },
  });

  const onSubmit = async (values: AdmissionFormValues) => {
    setServerError(null);
    try {
      const res = await submitAdmissionAction(organisation.id, values);
      if (res.success) {
        setSubmissionResult({
          success: true,
          referenceNumber: res.referenceNumber,
          studentName: values.studentName,
          parentName: values.parentName,
          courseName: values.preferredCourse,
        });
        reset();
      } else {
        if (res.fieldErrors) {
          for (const [key, msg] of Object.entries(res.fieldErrors)) {
            setError(key as keyof AdmissionFormValues, { message: msg });
          }
        }
        setServerError(res.error || 'Failed to submit admission enquiry. Please verify details.');
      }
    } catch {
      setServerError('A network connectivity issue occurred. Please check your connection and try again.');
    }
  };

  const handleResetAnother = () => {
    setSubmissionResult(null);
    setServerError(null);
    reset({
      studentName: '',
      parentName: '',
      phoneNumber: '',
      email: '',
      studentClass: '',
      preferredCourse: '',
      message: '',
      websiteUrl: '',
    });
  };

  const classLevels = [
    'Class 5',
    'Class 6',
    'Class 7',
    'Class 8',
    'Class 9',
    'Class 10 (SSLC / CBSE)',
    'Class 11 (Plus One)',
    'Class 12 (Plus Two)',
    'Repeater / Entrance Only',
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Form Card Header */}
      <div className="bg-theme-navy text-white px-6 sm:px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
              Online Application
            </span>
            <h2 className="text-xl sm:text-2xl font-bold mt-1">
              Admission Registration Enquiry
            </h2>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-medium border border-white/15">
            <Calendar className="w-3.5 h-3.5 text-blue-300" />
            <span>Session {settings.academicYear}</span>
          </div>
        </div>
        <p className="text-xs text-slate-300 mt-2 leading-relaxed">
          Submit student details to reserve an academic counseling slot at {organisation.name}.
        </p>
      </div>

      <div className="p-6 sm:p-8">
        {/* Success State */}
        {submissionResult?.success ? (
          <div className="py-8 px-4 text-center max-w-lg mx-auto space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Application Received
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-3">
                Admission Enquiry Submitted Successfully!
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Thank you, <span className="font-semibold text-slate-800">{submissionResult.parentName}</span>. Your enquiry for <span className="font-semibold text-slate-800">{submissionResult.studentName}</span> has been assigned to the {organisation.name} admissions desk.
              </p>
            </div>

            {/* Reference Badge Card */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-left space-y-2 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Application Reference Code</span>
                <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {submissionResult.referenceNumber}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Selected Program</span>
                <span className="font-semibold text-slate-800">{submissionResult.courseName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Institution</span>
                <span className="font-semibold text-slate-800">{organisation.name}</span>
              </div>
            </div>

            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-[11px] text-blue-900 flex items-start gap-2 text-left">
              <Info className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                Our academic counselor will contact you at your registered phone number within 24 working hours to schedule diagnostic testing and counseling.
              </div>
            </div>

            <button
              onClick={handleResetAnother}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Register Another Student
            </button>
          </div>
        ) : (
          /* Form Fields */
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {serverError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            {/* Honeypot field (hidden from genuine users) */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="websiteUrl">Leave this field blank</label>
              <input
                id="websiteUrl"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                {...register('websiteUrl')}
              />
            </div>

            {/* Student & Parent Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Student Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Arjun Nair"
                  {...register('studentName')}
                  className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all ${errors.studentName ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                    }`}
                />
                {errors.studentName && (
                  <p className="mt-1 text-[11px] text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    {errors.studentName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Parent / Guardian Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Suresh Kumar"
                  {...register('parentName')}
                  className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all ${errors.parentName ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                    }`}
                />
                {errors.parentName && (
                  <p className="mt-1 text-[11px] text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    {errors.parentName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Mobile / Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="e.g. +91 98765 43210"
                  {...register('phoneNumber')}
                  className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all ${errors.phoneNumber ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                    }`}
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-[11px] text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="e.g. parent@example.com"
                  {...register('email')}
                  className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all ${errors.email ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                    }`}
                />
                {errors.email && (
                  <p className="mt-1 text-[11px] text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            {/* Class & Preferred Course */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Student Current Class <span className="text-rose-500">*</span>
                </label>
                <select
                  {...register('studentClass')}
                  className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all ${errors.studentClass ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                    }`}
                >
                  <option value="">Select Student Class</option>
                  {classLevels.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
                {errors.studentClass && (
                  <p className="mt-1 text-[11px] text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    {errors.studentClass.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Preferred Tuition / Coaching Program <span className="text-rose-500">*</span>
                </label>
                <select
                  {...register('preferredCourse')}
                  className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all ${errors.preferredCourse ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                    }`}
                >
                  <option value="">Select Desired Course</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.title}>
                      {c.title} ({c.level})
                    </option>
                  ))}
                  <option value="General Academic Counseling">General Academic Counseling</option>
                </select>
                {errors.preferredCourse && (
                  <p className="mt-1 text-[11px] text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    {errors.preferredCourse.message}
                  </p>
                )}
              </div>
            </div>

            {/* Optional Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Special Requests or Academic Background (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Mention specific areas for improvement (e.g. Mathematics confidence, board exam preparation, batch timing preferences)..."
                {...register('message')}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all leading-relaxed"
              />
              {errors.message && (
                <p className="mt-1 text-[11px] text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                  {errors.message.message}
                </p>
              )}
            </div>

            {/* Notice Strip */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 flex items-start gap-2">
              <FileCheck2 className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
              <span>
                By submitting this form, you authorize {organisation.name} to send course information, counseling appointments, and fee structures via SMS/WhatsApp/Call.
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-6 btn-theme-primary text-white bg-theme-primary font-semibold rounded-lg text-xs shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Registering Admission Enquiry...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Admission Registration Form
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
