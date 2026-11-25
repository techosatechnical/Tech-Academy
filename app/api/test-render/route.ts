import { NextResponse } from 'next/server';
import { getOrganisationBySlug, getCompleteOrganisationData } from '@/lib/services/organisationService';

export async function GET() {
  const result: Record<string, unknown> = {};

  try {
    const org = await getOrganisationBySlug('bright');
    result.org = {
      id: org?.id,
      name: org?.name,
      slug: org?.slug,
      theme: org?.theme,
      hasContact: Boolean(org?.contact),
    };
  } catch (e: unknown) {
    const err = e as Error;
    result.orgError = { message: err.message, stack: err.stack };
  }

  try {
    const complete = await getCompleteOrganisationData('bright');
    result.complete = {
      name: complete.organisation?.name,
      themePrimary: complete.organisation?.theme?.primaryColor,
      settingsNotice: complete.settings?.admissionNotice,
      homeHeading: complete.homePage?.heroHeading,
      coursesCount: complete.courses?.length,
      teachersCount: complete.teachers?.length,
      announcementsCount: complete.announcements?.length,
      galleryCount: complete.gallery?.length,
      resultsCount: complete.results?.length,
      testimonialsCount: complete.testimonials?.length,
      faqsCount: complete.faqs?.length,
    };
  } catch (e: unknown) {
    const err = e as Error;
    result.completeError = { message: err.message, stack: err.stack };
  }

  return NextResponse.json(result);
}
