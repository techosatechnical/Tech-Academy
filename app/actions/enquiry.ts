'use server';

import { saveEnquiry } from '@/lib/services/organisationService';
import { Enquiry } from '@/types';
import {
  admissionFormSchema,
  contactFormSchema,
  AdmissionFormValues,
  ContactFormValues,
} from '@/lib/validations/enquiry';
import { revalidatePath } from 'next/cache';

export interface SubmitEnquiryResult {
  success: boolean;
  id?: string;
  referenceNumber?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
}

/**
 * Server Action: Submit Admission Enquiry with Zod validation and spam honeypot
 */
export async function submitAdmissionAction(
  organisationId: string,
  rawData: AdmissionFormValues
): Promise<SubmitEnquiryResult> {
  // 1. Honeypot check
  if (rawData.websiteUrl && rawData.websiteUrl.trim().length > 0) {
    // Silently drop bot submissions
    return {
      success: true,
      id: 'bot-filtered',
      referenceNumber: 'ADM-BOT-REJECTED',
    };
  }

  // 2. Validate payload with Zod
  const validation = admissionFormSchema.safeParse(rawData);
  if (!validation.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of validation.error.issues) {
      const field = issue.path[0];
      if (typeof field === 'string' && !fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    }
    return {
      success: false,
      error: 'Please correct the highlighted errors in the form.',
      fieldErrors,
    };
  }

  const validData = validation.data;
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const referenceNumber = `ADM-${new Date().getFullYear()}-${randomSuffix}`;

  try {
    const enquiryPayload: Omit<Enquiry, 'id' | 'createdAt' | 'status' | 'organisationId'> = {
      type: 'admission',
      studentName: validData.studentName,
      parentName: validData.parentName,
      email: validData.email,
      phone: validData.phoneNumber,
      studentClass: validData.studentClass,
      preferredCourse: validData.preferredCourse,
      message: validData.message || '',
    };

    const res = await saveEnquiry(organisationId, enquiryPayload);
    if (!res.success) {
      return { success: false, error: res.error || 'Failed to submit admission enquiry.' };
    }

    revalidatePath('/admin/enquiries');
    return {
      success: true,
      id: res.id,
      referenceNumber,
    };
  } catch (error) {
    console.error('submitAdmissionAction error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred.',
    };
  }
}

/**
 * Server Action: Submit Contact / Feedback Message with Zod validation
 */
export async function submitContactAction(
  organisationId: string,
  rawData: ContactFormValues
): Promise<SubmitEnquiryResult> {
  // 1. Honeypot check
  if (rawData.websiteUrl && rawData.websiteUrl.trim().length > 0) {
    return {
      success: true,
      id: 'bot-filtered',
      referenceNumber: 'CNT-BOT-REJECTED',
    };
  }

  // 2. Validate payload with Zod
  const validation = contactFormSchema.safeParse(rawData);
  if (!validation.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of validation.error.issues) {
      const field = issue.path[0];
      if (typeof field === 'string' && !fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    }
    return {
      success: false,
      error: 'Please correct the highlighted errors in the form.',
      fieldErrors,
    };
  }

  const validData = validation.data;
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const referenceNumber = `CNT-${new Date().getFullYear()}-${randomSuffix}`;

  try {
    const enquiryPayload: Omit<Enquiry, 'id' | 'createdAt' | 'status' | 'organisationId'> = {
      type: 'contact',
      fullName: validData.fullName,
      email: validData.email,
      phone: validData.phone,
      subject: validData.subject,
      message: validData.message,
    };

    const res = await saveEnquiry(organisationId, enquiryPayload);
    if (!res.success) {
      return { success: false, error: res.error || 'Failed to send message.' };
    }

    revalidatePath('/admin/enquiries');
    return {
      success: true,
      id: res.id,
      referenceNumber,
    };
  } catch (error) {
    console.error('submitContactAction error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred.',
    };
  }
}

/**
 * Legacy wrapper for backward compatibility
 */
export async function submitEnquiryAction(
  organisationId: string,
  enquiryData: Omit<Enquiry, 'id' | 'createdAt' | 'status' | 'organisationId'>
): Promise<{ success: boolean; id?: string; error?: string }> {
  return await saveEnquiry(organisationId, enquiryData);
}
