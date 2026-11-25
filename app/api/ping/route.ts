import { NextResponse } from 'next/server';

export async function GET() {
  const envKeys = Object.keys(process.env).filter(
    (k) => k.startsWith('NEXT_PUBLIC_') || k.startsWith('FIREBASE_')
  );

  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    definedKeys: envKeys,
    hasApiKey: Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
    hasProjectId: Boolean(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID),
  });
}
