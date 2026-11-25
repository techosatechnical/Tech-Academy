'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { UserProfile } from '@/types';
import {
  createSessionAction,
  destroySessionAction,
  getCurrentUserSessionAction,
} from '@/app/actions/auth';

interface AuthContextType {
  firebaseUser: User | null;
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<{ success: boolean; error?: string }>;
  isSuperAdmin: boolean;
  isOrgAdmin: boolean;
  isEditor: boolean;
  canManageOrganisation: (orgId: string) => boolean;
  canManageUsers: boolean;
  canEditSettings: boolean;
}

const defaultAuthContext: AuthContextType = {
  firebaseUser: null,
  user: null,
  loading: true,
  error: null,
  login: async () => ({ success: false, error: 'Auth not initialized' }),
  logout: async () => {},
  sendPasswordReset: async () => ({ success: false, error: 'Auth not initialized' }),
  isSuperAdmin: false,
  isOrgAdmin: false,
  isEditor: false,
  canManageOrganisation: () => false,
  canManageUsers: false,
  canEditSettings: false,
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If Firebase auth is not available (e.g. env vars missing)
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentFbUser) => {
      setFirebaseUser(currentFbUser);

      if (currentFbUser) {
        try {
          const idToken = await currentFbUser.getIdToken();
          const sessionResult = await createSessionAction(idToken);
          if (sessionResult.success && sessionResult.user) {
            setUser(sessionResult.user);
          } else {
            // Fallback to checking session if already set
            const currentSession = await getCurrentUserSessionAction();
            if (currentSession.isAuthenticated && currentSession.user) {
              setUser(currentSession.user);
            }
          }
        } catch (err) {
          console.error('Failed to sync auth session:', err);
        }
      } else {
        setUser(null);
        await destroySessionAction();
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setError(null);
    if (!auth) {
      return { success: false, error: 'Firebase Auth is not initialized. Please verify your environment variables.' };
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      const sessionResult = await createSessionAction(idToken);

      if (sessionResult.success && sessionResult.user) {
        setUser(sessionResult.user);
        return { success: true };
      } else {
        return { success: false, error: sessionResult.error || 'Failed to initialize session.' };
      }
    } catch (err: unknown) {
      const fbError = err as { code?: string; message?: string };
      let friendlyMessage = 'Authentication failed. Please check your credentials.';

      if (fbError.code === 'auth/invalid-credential' || fbError.code === 'auth/wrong-password' || fbError.code === 'auth/user-not-found') {
        friendlyMessage = 'Invalid email address or password.';
      } else if (fbError.code === 'auth/too-many-requests') {
        friendlyMessage = 'Access to this account has been temporarily disabled due to many failed login attempts. You can try again later.';
      } else if (fbError.code === 'auth/invalid-email') {
        friendlyMessage = 'Please enter a valid email address.';
      } else if (fbError.message) {
        friendlyMessage = fbError.message;
      }

      setError(friendlyMessage);
      return { success: false, error: friendlyMessage };
    }
  };

  const logout = async (): Promise<void> => {
    if (auth) {
      await signOut(auth);
    }
    await destroySessionAction();
    setUser(null);
    setFirebaseUser(null);
  };

  const sendPasswordReset = async (email: string): Promise<{ success: boolean; error?: string }> => {
    if (!auth) {
      return { success: false, error: 'Firebase Auth is not initialized.' };
    }
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (err: unknown) {
      const fbError = err as { message?: string };
      return { success: false, error: fbError.message || 'Failed to send password reset email.' };
    }
  };

  // Role permissions evaluation
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';
  const isOrgAdmin = user?.role === 'ORGANISATION_ADMIN';
  const isEditor = user?.role === 'EDITOR';

  const canManageOrganisation = useCallback(
    (orgId: string): boolean => {
      if (!user) return false;
      if (user.role === 'SUPER_ADMIN') return true;
      return user.organisationIds.includes(orgId);
    },
    [user]
  );

  const canManageUsers = isSuperAdmin;
  const canEditSettings = isSuperAdmin || isOrgAdmin;

  const contextValue = useMemo(
    () => ({
      firebaseUser,
      user,
      loading,
      error,
      login,
      logout,
      sendPasswordReset,
      isSuperAdmin,
      isOrgAdmin,
      isEditor,
      canManageOrganisation,
      canManageUsers,
      canEditSettings,
    }),
    [
      firebaseUser,
      user,
      loading,
      error,
      isSuperAdmin,
      isOrgAdmin,
      isEditor,
      canManageOrganisation,
      canManageUsers,
      canEditSettings,
    ]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  return context || defaultAuthContext;
}
