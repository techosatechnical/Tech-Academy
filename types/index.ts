// =====================================================================
// Tech Academy / Multi-Organisation TypeScript Type Definitions
// =====================================================================

export type UserRole = 'SUPER_ADMIN' | 'ORGANISATION_ADMIN' | 'EDITOR';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  organisationIds: string[]; // empty if SUPER_ADMIN, otherwise IDs of assigned organisations
  createdAt: string | number;
}

export interface ContactInfo {
  phone: string;
  altPhone?: string;
  email: string;
  address: string;
  landmark?: string;
  workingHours: string;
  sundayHours?: string;
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  youtube?: string;
  linkedin?: string;
}

export interface OrganisationTheme {
  primaryColor: string;     // e.g. #1E40AF (Blue) or #EA580C (Orange)
  secondaryColor: string;   // e.g. #3B82F6 or #F97316
  darkNavyColor: string;    // e.g. #172554 or #7C2D12
  lightBgColor: string;     // e.g. #F8FAFC or #FFF7ED
  lightBlueColor: string;   // e.g. #EFF6FF or #FFEDD5
}

export interface Organisation {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  logoUrl?: string;
  theme: OrganisationTheme;
  contact: ContactInfo;
  socialLinks?: SocialLinks;
  status: 'active' | 'inactive';
  createdAt: string | number;
}

export interface OrganisationSettings {
  metaTitle: string;
  metaDescription: string;
  admissionOpen: boolean;
  admissionNotice?: string;
  academicYear: string;
}

export interface HomePageContent {
  heroBadge: string;
  heroHeading: string;
  heroHeadingAccent: string;
  heroSubheading: string;
  heroImageUrl: string;
  stats: { value: string; label: string; description?: string }[];
  aboutPreview: {
    badge: string;
    heading: string;
    text1: string;
    text2: string;
    imageUrl: string;
    cardTitle: string;
    cardDescription: string;
    pillars: { title: string; description: string }[];
  };
  features: {
    title: string;
    description: string;
    highlight: string;
    iconName?: string;
  }[];
}

export interface AboutPageContent {
  title: string;
  subtitle: string;
  overviewHeading: string;
  overviewText1: string;
  overviewText2: string;
  imageUrl: string;
  stats: { value: string; label: string }[];
  mission: string;
  missionPoints: string[];
  vision: string;
  visionPoints: string[];
  methodology: { step: string; title: string; desc: string }[];
  educationalValues: { title: string; desc: string }[];
  whyChooseUsPoints: string[];
}

export interface Course {
  id: string;
  organisationId?: string;
  title: string;
  level: string;
  classGroup: string;
  subjects: string[];
  shortDescription: string;
  fullDescription?: string;
  duration: string;
  batchTiming: string;
  highlights: string[];
  isPopular?: boolean;
  category: 'school' | 'higher-secondary' | 'entrance' | 'specialized';
  fee?: string;
}

export interface FacultyMember {
  id: string;
  organisationId?: string;
  name: string;
  subject: string;
  designation: string;
  qualification: string;
  experienceYears: number;
  description: string;
  image: string;
  specialization?: string;
}

export interface GalleryImage {
  id: string;
  organisationId?: string;
  title: string;
  imageUrl: string;
  category: string;
  uploadedAt: string | number;
}

export interface Announcement {
  id: string;
  organisationId?: string;
  title: string;
  content: string;
  date: string;
  priority: 'low' | 'medium' | 'high';
  isActive: boolean;
  badge?: string;
}

export interface StudentResult {
  id: string;
  organisationId?: string;
  studentName: string;
  classLevel: string;
  examination: string;
  score: string;
  percentileOrRank?: string;
  academicYear: string;
  achievementHighlight: string;
  image: string;
  stream?: string;
}

export interface Testimonial {
  id: string;
  organisationId?: string;
  studentName: string;
  parentName?: string;
  courseOrClass: string;
  feedback: string;
  rating: number;
  year: string;
  studentRole: string;
  image: string;
}

export interface FAQItem {
  id: string;
  organisationId?: string;
  question: string;
  answer: string;
  category?: string;
}

export type EnquiryType = 'admission' | 'contact';
export type EnquiryStatus = 'new' | 'contacted' | 'in_review' | 'enrolled' | 'closed';

export interface Enquiry {
  id: string;
  organisationId: string;
  type: EnquiryType;
  studentName?: string;
  parentName?: string;
  fullName?: string;
  email: string;
  phone: string;
  studentClass?: string;
  preferredCourse?: string;
  subject?: string;
  message: string;
  status: EnquiryStatus;
  createdAt: string | number;
}

export interface AdmissionFormData {
  studentName: string;
  parentName: string;
  phoneNumber: string;
  email: string;
  studentClass: string;
  preferredCourse: string;
  message: string;
}

export interface ContactFormData {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}
