import { NextResponse } from 'next/server';

export async function GET() {
  const status: Record<string, unknown> = {};

  try {
    await import('firebase-admin/app');
    status.app = 'ok';
  } catch (e: any) {
    status.app = e.message;
  }

  try {
    await import('firebase-admin/firestore');
    status.firestore = 'ok';
  } catch (e: any) {
    status.firestore = e.message;
  }

  try {
    await import('firebase-admin/auth');
    status.auth = 'ok';
  } catch (e: any) {
    status.auth = e.message;
  }

  try {
    await import('firebase-admin/storage');
    status.storage = 'ok';
  } catch (e: any) {
    status.storage = e.message;
  }

  try {
    await import('@/lib/firebase/admin');
    status.adminModule = 'ok';
  } catch (e: any) {
    status.adminModule = e.message;
  }

  try {
    await import('@/lib/services/organisationService');
    status.organisationService = 'ok';
  } catch (e: any) {
    status.organisationService = e.message;
  }

  return NextResponse.json(status);
}
