import { NextResponse } from 'next/server';
import { isFirebaseAdminConfigured, adminDb } from '@/lib/firebase/admin';
import { getOrganisationBySlug, getCompleteOrganisationData } from '@/lib/services/organisationService';

export async function GET() {
  const diagnostics: Record<string, unknown> = {
    env: {
      hasProjectId: Boolean(process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
      hasClientEmail: Boolean(process.env.FIREBASE_CLIENT_EMAIL),
      hasPrivateKey: Boolean(process.env.FIREBASE_PRIVATE_KEY),
      privateKeyLength: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.length : 0,
      privateKeyStartsWith: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.slice(0, 25) : null,
      isFirebaseAdminConfigured: isFirebaseAdminConfigured(),
      hasAdminDb: Boolean(adminDb),
    },
  };

  try {
    const org = await getOrganisationBySlug('bright');
    diagnostics.getOrganisationBySlug = {
      success: true,
      orgFound: Boolean(org),
      orgName: org?.name,
    };
  } catch (err: unknown) {
    const error = err as Error;
    diagnostics.getOrganisationBySlug = {
      success: false,
      error: error.message,
      stack: error.stack,
    };
  }

  try {
    const complete = await getCompleteOrganisationData('bright');
    diagnostics.getCompleteOrganisationData = {
      success: true,
      hasTheme: Boolean(complete.organisation?.theme),
      primaryColor: complete.organisation?.theme?.primaryColor,
      coursesCount: complete.courses?.length,
      teachersCount: complete.teachers?.length,
    };
  } catch (err: unknown) {
    const error = err as Error;
    diagnostics.getCompleteOrganisationData = {
      success: false,
      error: error.message,
      stack: error.stack,
    };
  }

  return NextResponse.json(diagnostics);
}
