import { getAdminAuth, adminDb } from '@/lib/firebase/admin';
import { UserProfile, UserRole } from '@/types';

const USERS_COLLECTION = 'users';

/**
 * Fetch a user profile from Firestore by User ID
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  if (!adminDb) {
    console.warn('adminDb is not initialized');
    return null;
  }

  try {
    const userDoc = await adminDb.collection(USERS_COLLECTION).doc(userId).get();
    if (!userDoc.exists) {
      return null;
    }
    const data = userDoc.data();
    return {
      id: userDoc.id,
      email: data?.email || '',
      displayName: data?.displayName || '',
      role: (data?.role as UserRole) || 'EDITOR',
      organisationIds: data?.organisationIds || [],
      createdAt: data?.createdAt || new Date().toISOString(),
    };
  } catch (error) {
    console.error(`Error fetching user profile for ${userId}:`, error);
    return null;
  }
}

/**
 * Create or update a user profile in Firestore
 */
export async function saveUserProfile(profile: UserProfile): Promise<void> {
  if (!adminDb) {
    throw new Error('adminDb is not initialized');
  }

  await adminDb.collection(USERS_COLLECTION).doc(profile.id).set(
    {
      email: profile.email,
      displayName: profile.displayName,
      role: profile.role,
      organisationIds: profile.organisationIds || [],
      updatedAt: new Date().toISOString(),
      createdAt: profile.createdAt || new Date().toISOString(),
    },
    { merge: true }
  );

  // Also sync custom claims to Firebase Auth if adminAuth is available
  const auth = (await getAdminAuth()) as any;
  if (auth) {
    try {
      await auth.setCustomUserClaims(profile.id, {
        role: profile.role,
        organisationIds: profile.organisationIds || [],
      });
    } catch (claimError) {
      console.warn(`Failed to set custom claims for user ${profile.id}:`, claimError);
    }
  }
}

/**
 * Verify a Firebase ID Token on the server
 */
export async function verifyServerToken(idToken: string): Promise<{
  uid: string;
  email?: string;
  role: UserRole;
  organisationIds: string[];
} | null> {
  const auth = (await getAdminAuth()) as any;
  if (!auth) {
    console.warn('adminAuth is not initialized');
    return null;
  }

  try {
    const decoded = await auth.verifyIdToken(idToken);
    const profile = await getUserProfile(decoded.uid);

    return {
      uid: decoded.uid,
      email: decoded.email,
      role: profile?.role || (decoded.role as UserRole) || 'EDITOR',
      organisationIds: profile?.organisationIds || (decoded.organisationIds as string[]) || [],
    };
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    return null;
  }
}

/**
 * Create a session cookie string from a valid ID token
 */
export async function createServerSessionCookie(idToken: string, expiresInDays = 5): Promise<string | null> {
  const auth = (await getAdminAuth()) as any;
  if (!auth) {
    console.warn('adminAuth is not initialized');
    return null;
  }

  try {
    const expiresIn = expiresInDays * 24 * 60 * 60 * 1000;
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });
    return sessionCookie;
  } catch (error) {
    console.error('Error creating session cookie:', error);
    return null;
  }
}

/**
 * Verify session cookie on the server
 */
export async function verifyServerSessionCookie(sessionCookie: string): Promise<{
  uid: string;
  email?: string;
  role: UserRole;
  organisationIds: string[];
} | null> {
  const auth = (await getAdminAuth()) as any;
  if (!auth) {
    console.warn('adminAuth is not initialized');
    return null;
  }

  try {
    const decoded = await auth.verifySessionCookie(sessionCookie, true);
    const profile = await getUserProfile(decoded.uid);

    return {
      uid: decoded.uid,
      email: decoded.email,
      role: profile?.role || (decoded.role as UserRole) || 'EDITOR',
      organisationIds: profile?.organisationIds || (decoded.organisationIds as string[]) || [],
    };
  } catch {
    return null;
  }
}

/**
 * Provision or seed a user with Auth and Firestore Profile
 */
export async function provisionUser(userData: {
  email: string;
  password?: string;
  displayName: string;
  role: UserRole;
  organisationIds?: string[];
}): Promise<UserProfile> {
  const auth = (await getAdminAuth()) as any;
  if (!auth || !adminDb) {
    throw new Error('Firebase Admin SDK is not properly configured.');
  }

  let userRecord;
  try {
    userRecord = await auth.getUserByEmail(userData.email);
    // Update password if provided
    if (userData.password) {
      await auth.updateUser(userRecord.uid, {
        password: userData.password,
        displayName: userData.displayName,
      });
    }
  } catch {
    // User does not exist, create new user
    userRecord = await auth.createUser({
      email: userData.email,
      password: userData.password || 'Admin@123456',
      displayName: userData.displayName,
    });
  }

  const profile: UserProfile = {
    id: userRecord.uid,
    email: userData.email,
    displayName: userData.displayName,
    role: userData.role,
    organisationIds: userData.organisationIds || [],
    createdAt: new Date().toISOString(),
  };

  await saveUserProfile(profile);
  return profile;
}

/**
 * List all registered users
 */
export async function listAllUsers(): Promise<UserProfile[]> {
  if (!adminDb) return [];
  try {
    const snapshot = await adminDb.collection(USERS_COLLECTION).get();
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        email: data.email || '',
        displayName: data.displayName || '',
        role: data.role as UserRole,
        organisationIds: data.organisationIds || [],
        createdAt: data.createdAt || '',
      };
    });
  } catch (error) {
    console.error('Error listing users:', error);
    return [];
  }
}
