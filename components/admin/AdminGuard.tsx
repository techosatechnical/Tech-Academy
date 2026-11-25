'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import { ShieldAlert, Loader2, Lock } from 'lucide-react';
import Link from 'next/link';

interface AdminGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requiredOrgId?: string;
}

export function AdminGuard({ children, allowedRoles, requiredOrgId }: AdminGuardProps) {
  const { user, firebaseUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !firebaseUser) {
      router.push('/admin/login');
    }
  }, [loading, firebaseUser, router]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center max-w-sm w-full mx-4 text-center">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
          <h2 className="text-lg font-bold text-slate-800 mb-1">Verifying Credentials</h2>
          <p className="text-sm text-slate-500">
            Checking your administrative authorization level...
          </p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!firebaseUser) {
    return null; // Will redirect via useEffect
  }

  // Check role authorization
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-rose-200 max-w-md w-full text-center">
          <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Restricted Access</h2>
          <p className="text-slate-600 text-sm mb-4 leading-relaxed">
            Your account role (<span className="font-semibold text-slate-800">{user.role}</span>) does not have permission to view this section.
          </p>
          <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-600 border border-slate-200 text-left mb-6 space-y-1">
            <p><span className="font-semibold">Logged In As:</span> {user.email}</p>
            <p><span className="font-semibold">Required Role:</span> {allowedRoles.join(' or ')}</p>
          </div>
          <Link
            href="/admin"
            className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-blue-700 text-white rounded-lg text-sm font-semibold hover:bg-blue-800 transition-colors shadow-sm"
          >
            Return to Admin Home
          </Link>
        </div>
      </div>
    );
  }

  // Check organisation authorization
  if (requiredOrgId && user && user.role !== 'SUPER_ADMIN' && !user.organisationIds.includes(requiredOrgId)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-amber-200 max-w-md w-full text-center">
          <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Organisation Access Denied</h2>
          <p className="text-slate-600 text-sm mb-4">
            You do not have administrative permissions for organisation ID: <span className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded font-bold">{requiredOrgId}</span>.
          </p>
          <Link
            href="/admin"
            className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-slate-800 text-white rounded-lg text-sm font-semibold hover:bg-slate-900 transition-colors"
          >
            Return to My Organisations
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
