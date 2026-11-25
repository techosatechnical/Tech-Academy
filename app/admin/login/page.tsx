'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth, AuthProvider } from '@/context/AuthContext';
import {
  GraduationCap,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Shield,
  KeyRound,
  ArrowRight,
  Database,
} from 'lucide-react';
import Link from 'next/link';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/admin';

  const { login, sendPasswordReset, firebaseUser, loading: authLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Password reset modal state
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetStatus, setResetStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Seed status
  const [seedingUsers, setSeedingUsers] = useState(false);
  const [seedNotice, setSeedNotice] = useState<string | null>(null);

  // If already logged in, redirect to admin
  useEffect(() => {
    if (!authLoading && firebaseUser) {
      router.push(redirectUrl);
    }
  }, [authLoading, firebaseUser, router, redirectUrl]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!email || !password) {
      setError('Please provide both your registered email address and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await login(email.trim(), password);
      if (res.success) {
        setSuccessMessage('Authentication successful. Redirecting to dashboard...');
        setTimeout(() => {
          router.push(redirectUrl);
        }, 500);
      } else {
        setError(res.error || 'Failed to authenticate.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      setResetStatus({ type: 'error', message: 'Please enter your registered email address.' });
      return;
    }

    setResetLoading(true);
    setResetStatus(null);
    try {
      const res = await sendPasswordReset(resetEmail.trim());
      if (res.success) {
        setResetStatus({
          type: 'success',
          message: 'Password reset link sent! Check your inbox to set a new password.',
        });
      } else {
        setResetStatus({ type: 'error', message: res.error || 'Failed to send reset link.' });
      }
    } catch {
      setResetStatus({ type: 'error', message: 'Failed to request password reset.' });
    } finally {
      setResetLoading(false);
    }
  };

  const handleSeedUsers = async () => {
    setSeedingUsers(true);
    setSeedNotice(null);
    try {
      const res = await fetch('/api/seed-users');
      const data = await res.json();
      if (data.success) {
        setSeedNotice('Default admin accounts initialized in Firebase! Click any test account below.');
      } else {
        setSeedNotice(`Notice: ${data.message || data.error || 'Check Firebase Console.'}`);
      }
    } catch {
      setSeedNotice('Failed to call seed endpoint. Check server console.');
    } finally {
      setSeedingUsers(false);
    }
  };

  const testAccounts = [
    {
      role: 'SUPER_ADMIN',
      label: 'Super Admin',
      email: 'superadmin@techacademy.edu',
      desc: 'Full access to all organisations, settings, & user management',
      color: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      role: 'ORGANISATION_ADMIN',
      label: 'Bright Academy Admin',
      email: 'bright.admin@techacademy.edu',
      desc: 'Administers tuition-001 (Bright Academy)',
      color: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      role: 'ORGANISATION_ADMIN',
      label: 'Excellence Tutorials Admin',
      email: 'excellence.admin@techacademy.edu',
      desc: 'Administers tuition-002 (Excellence Tutorials)',
      color: 'bg-orange-50 text-orange-700 border-orange-200',
    },
    {
      role: 'EDITOR',
      label: 'Content Editor',
      email: 'editor@techacademy.edu',
      desc: 'Can edit courses & teachers, cannot access settings',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
  ];

  const fillAccount = (accEmail: string) => {
    setEmail(accEmail);
    setPassword('Admin@123456');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background branding strip */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-800" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-2.5 group mb-4">
          <div className="w-12 h-12 rounded-xl bg-blue-900 text-white flex items-center justify-center shadow-md group-hover:bg-blue-800 transition-colors">
            <GraduationCap className="w-7 h-7" />
          </div>
          <div className="text-left">
            <span className="text-xl font-bold tracking-tight text-slate-900 block leading-tight">
              TECH ACADEMY
            </span>
            <span className="text-[11px] font-semibold text-blue-600 tracking-wider uppercase block">
              Admin Portal
            </span>
          </div>
        </Link>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Management Console
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Sign in with your institutional credentials to manage organisations, courses, and admissions.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 sm:rounded-2xl sm:px-10">
          {error && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-rose-700 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="leading-relaxed">{error}</div>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-emerald-700 text-sm">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <div>{successMessage}</div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Staff Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@techacademy.edu"
                  className="block w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setIsResetOpen(true)}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-10 pr-10 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg text-sm transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  Sign In to Management Portal
                </>
              )}
            </button>
          </form>

          {/* Quick Test Accounts Drawer */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-blue-600" />
                Role-Based Test Logins
              </span>
              <button
                type="button"
                onClick={handleSeedUsers}
                disabled={seedingUsers}
                className="text-xs text-blue-700 hover:text-blue-900 flex items-center gap-1 font-medium cursor-pointer"
              >
                {seedingUsers ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Database className="w-3 h-3" />
                )}
                Initialize Accounts
              </button>
            </div>

            {seedNotice && (
              <div className="p-2 mb-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800 leading-normal">
                {seedNotice}
              </div>
            )}

            <div className="space-y-2">
              {testAccounts.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => fillAccount(acc.email)}
                  className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all group flex items-center justify-between"
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-xs text-slate-800 group-hover:text-blue-700">
                        {acc.label}
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${acc.color}`}>
                        {acc.role}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">{acc.email}</div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                </button>
              ))}
            </div>

            <p className="mt-3 text-[11px] text-slate-400 text-center">
              Default password for all test accounts is <span className="font-mono font-semibold text-slate-600">Admin@123456</span>
            </p>
          </div>
        </div>

        {/* Back to public website */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs font-medium text-slate-500 hover:text-blue-700 transition-colors inline-flex items-center gap-1"
          >
            ← Return to Tech Academy Homepage
          </Link>
        </div>
      </div>

      {/* Password Reset Modal */}
      {isResetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-sm w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Reset Password</h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter your account email. Firebase will send you a secure link to create a new password.
            </p>

            {resetStatus && (
              <div
                className={`p-3 rounded-lg text-xs mb-4 leading-normal ${
                  resetStatus.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {resetStatus.message}
              </div>
            )}

            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="yourname@techacademy.edu"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsResetOpen(false);
                    setResetStatus(null);
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="px-4 py-1.5 text-xs font-semibold bg-blue-700 hover:bg-blue-800 text-white rounded-lg disabled:opacity-50 flex items-center gap-1.5"
                >
                  {resetLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Send Reset Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <AuthProvider>
      <Suspense
        fallback={
          <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        }
      >
        <AdminLoginForm />
      </Suspense>
    </AuthProvider>
  );
}

