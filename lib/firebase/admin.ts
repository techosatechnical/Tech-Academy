import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getStorage, Storage } from 'firebase-admin/storage';

export const isFirebaseAdminConfigured = (): boolean => {
  return Boolean(
    (process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  );
};

function formatPrivateKey(key: string | undefined): string | undefined {
  if (!key) return undefined;
  let formatted = key.trim();
  // Strip surrounding quotes if present
  if ((formatted.startsWith('"') && formatted.endsWith('"')) || (formatted.startsWith("'") && formatted.endsWith("'"))) {
    formatted = formatted.slice(1, -1);
  }
  // Replace literal \n and \r\n with actual newline
  formatted = formatted.replace(/\\r\\n/g, '\n').replace(/\\n/g, '\n').replace(/\r/g, '');
  return formatted;
}

let adminApp: App | null = null;
let adminDb: Firestore | null = null;
let adminStorage: Storage | null = null;
let adminAuthInstance: unknown = null;

try {
  if (getApps().length > 0) {
    adminApp = getApps()[0]!;
    adminDb = getFirestore(adminApp);
    adminStorage = getStorage(adminApp);
  } else if (isFirebaseAdminConfigured()) {
    const projectId =
      process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = formatPrivateKey(process.env.FIREBASE_PRIVATE_KEY);
    const storageBucket =
      process.env.FIREBASE_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

    if (projectId && clientEmail && privateKey) {
      adminApp = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
        storageBucket,
      });

      adminDb = getFirestore(adminApp);
      adminStorage = getStorage(adminApp);
    }
  }
} catch (error) {
  console.error('Firebase admin initialization failed safely:', error);
  adminApp = null;
  adminDb = null;
  adminStorage = null;
}

/**
 * Lazy-load Firebase Admin Auth dynamically to avoid CJS require(ESM) issues on serverless
 */
export async function getAdminAuth() {
  if (adminAuthInstance) return adminAuthInstance;
  if (!adminApp) return null;
  try {
    const { getAuth } = await import('firebase-admin/auth');
    adminAuthInstance = getAuth(adminApp);
    return adminAuthInstance;
  } catch (error) {
    console.warn('Dynamic load of firebase-admin/auth skipped or unsupported in this runtime:', error);
    return null;
  }
}

// Proxy exported adminAuth for backwards compatibility
export const adminAuth = null;

export { adminApp, adminDb, adminStorage };
