import { z } from 'zod';

/**
 * Validation schema for Admission Enquiry form
 */
export const admissionFormSchema = z.object({
  studentName: z
    .string()
    .trim()
    .min(3, { message: 'Student full name must be at least 3 characters.' })
    .max(80, { message: 'Student name cannot exceed 80 characters.' }),
  parentName: z
    .string()
    .trim()
    .min(3, { message: 'Parent or guardian name must be at least 3 characters.' })
    .max(80, { message: 'Parent name cannot exceed 80 characters.' }),
  phoneNumber: z
    .string()
    .trim()
    .min(10, { message: 'Please provide a valid phone number (at least 10 digits).' })
    .max(16, { message: 'Phone number is too long.' })
    .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,14}$/, {
      message: 'Please enter a valid telephone or mobile number.',
    }),
  email: z
    .string()
    .trim()
    .email({ message: 'Please enter a valid email address.' })
    .max(100, { message: 'Email address cannot exceed 100 characters.' }),
  studentClass: z
    .string()
    .min(1, { message: 'Please select the student’s current class level.' }),
  preferredCourse: z
    .string()
    .min(1, { message: 'Please select a preferred tuition or coaching program.' }),
  message: z
    .string()
    .trim()
    .max(1000, { message: 'Message cannot exceed 1000 characters.' })
    .optional()
    .or(z.literal('')),
  // Honeypot field for spam bots (must remain empty for real humans)
  websiteUrl: z.string().optional(),
});

export type AdmissionFormValues = z.infer<typeof admissionFormSchema>;

/**
 * Validation schema for General Contact & Feedback form
 */
export const contactFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, { message: 'Full name must be at least 3 characters.' })
    .max(80, { message: 'Full name cannot exceed 80 characters.' }),
  email: z
    .string()
    .trim()
    .email({ message: 'Please enter a valid email address.' })
    .max(100, { message: 'Email address cannot exceed 100 characters.' }),
  phone: z
    .string()
    .trim()
    .min(10, { message: 'Please enter a valid phone number (at least 10 digits).' })
    .max(16, { message: 'Phone number is too long.' })
    .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,14}$/, {
      message: 'Please enter a valid phone number.',
    }),
  subject: z
    .string()
    .trim()
    .min(3, { message: 'Please specify the subject of your enquiry.' })
    .max(120, { message: 'Subject cannot exceed 120 characters.' }),
  message: z
    .string()
    .trim()
    .min(10, { message: 'Please provide at least 10 characters in your message.' })
    .max(2000, { message: 'Message cannot exceed 2000 characters.' }),
  // Honeypot field
  websiteUrl: z.string().optional(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
