'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useOrganisation } from '@/context/OrganisationContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  contactFormSchema,
  ContactFormValues,
} from '@/lib/validations/enquiry';
import { submitContactAction } from '@/app/actions/enquiry';
import {
  CheckCircle2,
  AlertCircle,
  Send,
  Loader2,
  RotateCcw,
} from 'lucide-react';

export const ContactForm: React.FC = () => {
  const searchParams = useSearchParams();
  const initialSubject = searchParams.get('subject') || '';
  const { organisation } = useOrganisation();

  const [submissionResult, setSubmissionResult] = useState<{
    success: boolean;
    referenceNumber?: string;
    fullName?: string;
  } | null>(null);

  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      subject: initialSubject,
      message: '',
      websiteUrl: '',
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    setServerError(null);
    try {
      const res = await submitContactAction(organisation.id, values);
      if (res.success) {
        setSubmissionResult({
          success: true,
          referenceNumber: res.referenceNumber,
          fullName: values.fullName,
        });
        reset();
      } else {
        if (res.fieldErrors) {
          for (const [key, msg] of Object.entries(res.fieldErrors)) {
            setError(key as keyof ContactFormValues, { message: msg });
          }
        }
        setServerError(res.error || 'Failed to submit message. Please review details.');
      }
    } catch {
      setServerError('A network connectivity issue occurred. Please check your connection and try again.');
    }
  };

  const handleResetAnother = () => {
    setSubmissionResult(null);
    setServerError(null);
    reset({
      fullName: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      websiteUrl: '',
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-theme-navy text-white px-6 sm:px-8 py-6">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
          Enquiry & Support Desk
        </span>
        <h2 className="text-xl sm:text-2xl font-bold mt-1">Send Us a Direct Message</h2>
        <p className="text-xs text-slate-300 mt-2 leading-relaxed">
          Have questions about tuition batches, fee concessions, or syllabus coverage? Reach out directly to {organisation.name}.
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
                Message Received
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-3">
                Thank You, {submissionResult.fullName}!
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Your enquiry has been delivered to the administrative office at {organisation.name}. Our staff will review your request and get back to you shortly.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-left space-y-2 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Tracking Reference</span>
                <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {submissionResult.referenceNumber}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Institution</span>
                <span className="font-semibold text-slate-800">{organisation.name}</span>
              </div>
            </div>

            <button
              onClick={handleResetAnother}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Send Another Message
            </button>
          </div>
        ) : (
          /* Form Fields */
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {serverError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            {/* Honeypot field (hidden from genuine users) */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="contactWebsiteUrl">Leave this field blank</label>
              <input
                id="contactWebsiteUrl"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                {...register('websiteUrl')}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Meera Nambiar"
                {...register('fullName')}
                className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all ${
                  errors.fullName ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                }`}
              />
              {errors.fullName && (
                <p className="mt-1 text-[11px] text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="e.g. name@example.com"
                  {...register('email')}
                  className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all ${
                    errors.email ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-[11px] text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="e.g. +91 98765 43210"
                  {...register('phone')}
                  className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all ${
                    errors.phone ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                  }`}
                />
                {errors.phone && (
                  <p className="mt-1 text-[11px] text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Subject of Inquiry <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Inquiry regarding Plus One Science batch timings"
                {...register('subject')}
                className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all ${
                  errors.subject ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                }`}
              />
              {errors.subject && (
                <p className="mt-1 text-[11px] text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                  {errors.subject.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Detailed Message <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                placeholder="Please describe your enquiry in detail so our faculty or counselors can assist you..."
                {...register('message')}
                className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all leading-relaxed ${
                  errors.message ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                }`}
              />
              {errors.message && (
                <p className="mt-1 text-[11px] text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                  {errors.message.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-6 btn-theme-primary text-white font-semibold rounded-lg text-xs shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending Message...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Message to {organisation.name}
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
