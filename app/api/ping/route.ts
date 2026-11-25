import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    hasFirebaseKey: Boolean(process.env.FIREBASE_PRIVATE_KEY),
  });
}
