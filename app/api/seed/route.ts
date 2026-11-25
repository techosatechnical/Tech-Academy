import { NextResponse } from 'next/server';
import { seedOrganisations } from '@/lib/services/seedData';
import { isFirebaseAdminConfigured } from '@/lib/firebase/admin';

export async function GET() {
  if (!isFirebaseAdminConfigured()) {
    return NextResponse.json(
      {
        success: false,
        message:
          'Firebase Admin is not configured. Please ensure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY are set in .env.local.',
      },
      { status: 503 }
    );
  }

  const result = await seedOrganisations();
  return NextResponse.json(result, { status: result.success ? 200 : 500 });
}

export async function POST() {
  return GET();
}
