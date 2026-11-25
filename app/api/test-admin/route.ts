import { NextResponse } from 'next/server';

export async function GET() {
  const info: Record<string, unknown> = {
    projectId: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || null,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || null,
    hasKey: Boolean(process.env.FIREBASE_PRIVATE_KEY),
    keyLength: process.env.FIREBASE_PRIVATE_KEY?.length || 0,
    keyStartsWith: process.env.FIREBASE_PRIVATE_KEY?.slice(0, 30) || null,
    keyEndsWith: process.env.FIREBASE_PRIVATE_KEY?.slice(-30) || null,
  };

  try {
    const adminAppModule = await import('firebase-admin/app');
    const firestoreModule = await import('firebase-admin/firestore');

    info.firebaseAdminImported = true;

    const rawKey = process.env.FIREBASE_PRIVATE_KEY;
    let formattedKey = rawKey ? rawKey.trim() : undefined;
    if (formattedKey) {
      if ((formattedKey.startsWith('"') && formattedKey.endsWith('"')) || (formattedKey.startsWith("'") && formattedKey.endsWith("'"))) {
        formattedKey = formattedKey.slice(1, -1);
      }
      formattedKey = formattedKey.replace(/\\r\\n/g, '\n').replace(/\\n/g, '\n').replace(/\r/g, '');
    }

    info.formattedKeyLength = formattedKey?.length;
    info.formattedKeyHasNewlines = formattedKey ? formattedKey.includes('\n') : false;

    let app;
    if (adminAppModule.getApps().length > 0) {
      app = adminAppModule.getApps()[0];
      info.appStatus = 'reused';
    } else {
      app = adminAppModule.initializeApp({
        credential: adminAppModule.cert({
          projectId: (process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) as string,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL as string,
          privateKey: formattedKey,
        }),
      });
      info.appStatus = 'initialized';
    }

    const db = firestoreModule.getFirestore(app);
    info.dbInitialized = true;

    const doc = await db.collection('organisations').doc('tuition-001').get();
    info.firestoreQuerySuccess = true;
    info.docExists = doc.exists;
    info.docOrgName = doc.data()?.name;
  } catch (err: unknown) {
    const error = err as Error;
    info.error = {
      name: error?.name,
      message: error?.message,
      stack: error?.stack,
    };
  }

  return NextResponse.json(info);
}
