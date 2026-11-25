'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { CompleteOrganisationData, brightAcademyData } from '@/data/sampleOrganisations';

interface OrganisationContextValue {
  data: CompleteOrganisationData;
  organisation: CompleteOrganisationData['organisation'];
  settings: CompleteOrganisationData['settings'];
  homePage: CompleteOrganisationData['homePage'];
  aboutPage: CompleteOrganisationData['aboutPage'];
  courses: CompleteOrganisationData['courses'];
  teachers: CompleteOrganisationData['teachers'];
  gallery: CompleteOrganisationData['gallery'];
  announcements: CompleteOrganisationData['announcements'];
  results: CompleteOrganisationData['results'];
  testimonials: CompleteOrganisationData['testimonials'];
  faqs: CompleteOrganisationData['faqs'];
  basePath: string;
}

const OrganisationContext = createContext<OrganisationContextValue | null>(null);

export interface OrganisationProviderProps {
  initialData?: CompleteOrganisationData;
  basePath?: string;
  children: React.ReactNode;
}

export const OrganisationProvider: React.FC<OrganisationProviderProps> = ({
  initialData = brightAcademyData,
  basePath,
  children,
}) => {
  const computedBasePath = useMemo(() => {
    if (basePath !== undefined) return basePath;
    return initialData.organisation.slug ? `/${initialData.organisation.slug}` : '';
  }, [basePath, initialData.organisation.slug]);

  const value = useMemo<OrganisationContextValue>(() => {
    return {
      data: initialData,
      organisation: initialData.organisation,
      settings: initialData.settings,
      homePage: initialData.homePage,
      aboutPage: initialData.aboutPage,
      courses: initialData.courses,
      teachers: initialData.teachers,
      gallery: initialData.gallery,
      announcements: initialData.announcements,
      results: initialData.results,
      testimonials: initialData.testimonials,
      faqs: initialData.faqs,
      basePath: computedBasePath,
    };
  }, [initialData, computedBasePath]);

  return (
    <OrganisationContext.Provider value={value}>
      {children}
    </OrganisationContext.Provider>
  );
};

export function useOrganisation(): OrganisationContextValue {
  const context = useContext(OrganisationContext);
  if (!context) {
    // Graceful fallback to Bright Academy if rendered outside explicit provider
    return {
      data: brightAcademyData,
      organisation: brightAcademyData.organisation,
      settings: brightAcademyData.settings,
      homePage: brightAcademyData.homePage,
      aboutPage: brightAcademyData.aboutPage,
      courses: brightAcademyData.courses,
      teachers: brightAcademyData.teachers,
      gallery: brightAcademyData.gallery,
      announcements: brightAcademyData.announcements,
      results: brightAcademyData.results,
      testimonials: brightAcademyData.testimonials,
      faqs: brightAcademyData.faqs,
      basePath: '/bright',
    };
  }
  return context;
}
