'use server';

import { cookies } from 'next/headers';
import {
  createServerSessionCookie,
  verifyServerSessionCookie,
  getUserProfile,
  provisionUser,
  listAllUsers,
  saveUserProfile,
} from '@/lib/services/authService';
import { UserProfile, UserRole } from '@/types';

const SESSION_COOKIE_NAME = 'tech_academy_session';

/**
 * Creates and sets an HttpOnly session cookie from the client's Firebase ID token
 */
export async function createSessionAction(idToken: string): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
  try {
    const sessionCookie = await createServerSessionCookie(idToken, 5);
    if (!sessionCookie) {
      return { success: false, error: 'Failed to generate session cookie.' };
    }

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
      maxAge: 5 * 24 * 60 * 60, // 5 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
    });

    const sessionData = await verifyServerSessionCookie(sessionCookie);
    if (!sessionData) {
      return { success: false, error: 'Session verification failed.' };
    }

    const userProfile = await getUserProfile(sessionData.uid);
    return {
      success: true,
      user: userProfile || {
        id: sessionData.uid,
        email: sessionData.email || '',
        displayName: sessionData.email?.split('@')[0] || 'User',
        role: sessionData.role,
        organisationIds: sessionData.organisationIds,
        createdAt: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error('createSessionAction error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Authentication session failure.',
    };
  }
}

/**
 * Clears the session cookie upon logout
 */
export async function destroySessionAction(): Promise<{ success: boolean }> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
    return { success: true };
  } catch (error) {
    console.error('destroySessionAction error:', error);
    return { success: false };
  }
}

/**
 * Verifies current server session and returns user profile
 */
export async function getCurrentUserSessionAction(): Promise<{
  isAuthenticated: boolean;
  user: UserProfile | null;
}> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!sessionCookie) {
      return { isAuthenticated: false, user: null };
    }

    const verified = await verifyServerSessionCookie(sessionCookie);
    if (!verified) {
      return { isAuthenticated: false, user: null };
    }

    const user = await getUserProfile(verified.uid);
    return {
      isAuthenticated: true,
      user: user || {
        id: verified.uid,
        email: verified.email || '',
        displayName: verified.email?.split('@')[0] || 'User',
        role: verified.role,
        organisationIds: verified.organisationIds,
        createdAt: '',
      },
    };
  } catch (error) {
    console.error('getCurrentUserSessionAction error:', error);
    return { isAuthenticated: false, user: null };
  }
}

/**
 * Seed sample administrative users for immediate testing across all roles
 */
export async function seedAdminUsersAction(): Promise<{
  success: boolean;
  message: string;
  users?: Array<{ email: string; role: string; passwordHint: string }>;
}> {
  try {
    const defaultUsers: Array<{
      email: string;
      displayName: string;
      role: UserRole;
      organisationIds: string[];
      passwordHint: string;
    }> = [
      {
        email: 'superadmin@techacademy.edu',
        displayName: 'Master Administrator',
        role: 'SUPER_ADMIN',
        organisationIds: [],
        passwordHint: 'Admin@123456',
      },
      {
        email: 'bright.admin@techacademy.edu',
        displayName: 'Bright Academy Admin',
        role: 'ORGANISATION_ADMIN',
        organisationIds: ['tuition-001'],
        passwordHint: 'Admin@123456',
      },
      {
        email: 'excellence.admin@techacademy.edu',
        displayName: 'Excellence Tutorials Admin',
        role: 'ORGANISATION_ADMIN',
        organisationIds: ['tuition-002'],
        passwordHint: 'Admin@123456',
      },
      {
        email: 'editor@techacademy.edu',
        displayName: 'Content Editor',
        role: 'EDITOR',
        organisationIds: ['tuition-001'],
        passwordHint: 'Admin@123456',
      },
    ];

    const results = [];
    for (const u of defaultUsers) {
      await provisionUser({
        email: u.email,
        password: u.passwordHint,
        displayName: u.displayName,
        role: u.role,
        organisationIds: u.organisationIds,
      });
      results.push({ email: u.email, role: u.role, passwordHint: u.passwordHint });
    }

    return {
      success: true,
      message: 'Successfully seeded 4 administrative test accounts with full roles.',
      users: results,
    };
  } catch (error) {
    console.error('seedAdminUsersAction error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to seed admin users.',
    };
  }
}

/**
 * Super Admin: Create a new user with specific role and organisation permissions
 */
export async function createAdminUserAction(data: {
  email: string;
  password?: string;
  displayName: string;
  role: UserRole;
  organisationIds: string[];
}): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
  try {
    const session = await getCurrentUserSessionAction();
    if (!session.isAuthenticated || session.user?.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'Unauthorized: Only SUPER_ADMIN can create admin users.' };
    }

    const newUser = await provisionUser(data);
    return { success: true, user: newUser };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error creating user.',
    };
  }
}

/**
 * Super Admin: List all admin users
 */
export async function listAllUsersAction(): Promise<{
  success: boolean;
  users?: UserProfile[];
  error?: string;
}> {
  try {
    const session = await getCurrentUserSessionAction();
    if (!session.isAuthenticated || session.user?.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'Unauthorized: Only SUPER_ADMIN can list admin users.' };
    }

    const users = await listAllUsers();
    return { success: true, users };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error retrieving users.',
    };
  }
}

/**
 * Update user role or assigned organisations
 */
export async function updateUserRoleAction(
  userId: string,
  role: UserRole,
  organisationIds: string[]
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getCurrentUserSessionAction();
    if (!session.isAuthenticated || session.user?.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'Unauthorized: Only SUPER_ADMIN can change roles.' };
    }

    const currentProfile = await getUserProfile(userId);
    if (!currentProfile) {
      return { success: false, error: 'User not found.' };
    }

    currentProfile.role = role;
    currentProfile.organisationIds = organisationIds;
    await saveUserProfile(currentProfile);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error updating user role.',
    };
  }
}
