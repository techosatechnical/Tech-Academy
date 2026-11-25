'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Shield,
  BookOpen,
  Users,
  Bell,
  Inbox,
  ArrowRight,
  Building2,
  ExternalLink,
  CheckCircle,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user, isSuperAdmin, isOrgAdmin, isEditor } = useAuth();
  const [selectedOrg, setSelectedOrg] = useState<string>('tuition-001');

  useEffect(() => {
    if (user && !isSuperAdmin && user.organisationIds.length > 0) {
      setSelectedOrg(user.organisationIds[0]);
    }
  }, [user, isSuperAdmin]);

  const organisations = [
    { id: 'tuition-001', name: 'Bright Academy', slug: 'bright', color: 'border-blue-500' },
    { id: 'tuition-002', name: 'Excellence Tutorials', slug: 'excellence', color: 'border-orange-500' },
  ];

  const currentOrg = organisations.find((o) => o.id === selectedOrg) || organisations[0];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
      {/* Top Header / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Welcome back, {user?.displayName || 'Administrator'}
            </h1>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                isSuperAdmin
                  ? 'bg-purple-100 text-purple-800 border-purple-200'
                  : isOrgAdmin
                  ? 'bg-blue-100 text-blue-800 border-blue-200'
                  : 'bg-emerald-100 text-emerald-800 border-emerald-200'
              }`}
            >
              {user?.role}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Tech Academy Multi-Organisation Content Management & Administration System
          </p>
        </div>

        {/* Organisation Selector */}
        {isSuperAdmin && (
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-200 shadow-xs">
            <Building2 className="w-4 h-4 text-slate-400 ml-2" />
            <span className="text-xs font-semibold text-slate-600">Managing:</span>
            <select
              value={selectedOrg}
              onChange={(e) => setSelectedOrg(e.target.value)}
              className="text-xs font-semibold text-slate-800 bg-transparent pr-4 py-1 focus:outline-none cursor-pointer"
            >
              {organisations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name} ({org.slug})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Role Capabilities Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-950 rounded-2xl p-6 text-white shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-blue-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">
            <Shield className="w-4 h-4" />
            Verified Role Privileges
          </div>
          <div className="text-lg font-bold mb-1">
            {isSuperAdmin && 'Master System Authority (SUPER_ADMIN)'}
            {isOrgAdmin && `Organisation Authority (${currentOrg.name})`}
            {isEditor && 'Content Editor Authority (EDITOR)'}
          </div>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed mb-4">
            {isSuperAdmin &&
              'You have unrestricted authority to manage all organisations, configure global database models, assign administrator roles, and access every tenant dashboard.'}
            {isOrgAdmin &&
              `You have full administration privileges for ${currentOrg.name}, including website content updates, course catalog, faculty team, admissions pipeline, and announcements.`}
            {isEditor &&
              'You can create and edit courses, teachers, and announcements. Institutional settings and user management are restricted.'}
          </p>

          <div className="flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full border border-white/15">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Course Management
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full border border-white/15">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Faculty Management
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full border border-white/15">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Gallery & Media
            </span>
            {!isEditor && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full border border-white/15">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Enquiries & Admissions
              </span>
            )}
            {isSuperAdmin && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full border border-white/15">
                <CheckCircle className="w-3.5 h-3.5 text-purple-300" /> Multi-Tenant Role Control
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quick Launch Cards */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">
          Content & Administration Hub
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-blue-300 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-3">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm mb-1">Courses</h3>
              <p className="text-xs text-slate-500 mb-4">
                Manage curriculum, subjects, class levels, fees and batch timings.
              </p>
            </div>
            <Link
              href="/admin/courses"
              className="text-xs font-semibold text-blue-700 hover:text-blue-900 inline-flex items-center gap-1 group"
            >
              Manage Courses
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-blue-300 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm mb-1">Faculty & Teachers</h3>
              <p className="text-xs text-slate-500 mb-4">
                Update educator bios, qualifications, photos, and subject specialties.
              </p>
            </div>
            <Link
              href="/admin/teachers"
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1 group"
            >
              Manage Faculty
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-blue-300 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
                <Bell className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm mb-1">Announcements</h3>
              <p className="text-xs text-slate-500 mb-4">
                Broadcast exam alerts, admission dates, and top bar banner notices.
              </p>
            </div>
            <Link
              href="/admin/announcements"
              className="text-xs font-semibold text-amber-700 hover:text-amber-900 inline-flex items-center gap-1 group"
            >
              Post Announcement
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-blue-300 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center mb-3">
                <Inbox className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm mb-1">Enquiries</h3>
              <p className="text-xs text-slate-500 mb-4">
                View student admission requests and contact messages from parents.
              </p>
            </div>
            <Link
              href="/admin/enquiries"
              className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 inline-flex items-center gap-1 group"
            >
              Review Pipeline
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Organisation Quick Links */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Active Live Portals</h2>
            <p className="text-xs text-slate-500">
              Each organisation features its own custom theme, courses, faculty, and branding.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-sm text-slate-900">Bright Academy</span>
                <span className="text-[10px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded-full">
                  tuition-001
                </span>
              </div>
              <p className="text-xs text-slate-500">Theme: Blue & Navy • Slug: /bright</p>
            </div>
            <Link
              href="/bright"
              target="_blank"
              className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <span>Visit Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-4 rounded-xl border border-orange-200 bg-orange-50/40 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-sm text-slate-900">Excellence Tutorials</span>
                <span className="text-[10px] bg-orange-600 text-white font-bold px-2 py-0.5 rounded-full">
                  tuition-002
                </span>
              </div>
              <p className="text-xs text-slate-500">Theme: Orange & Warm Maroon • Slug: /excellence</p>
            </div>
            <Link
              href="/excellence"
              target="_blank"
              className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <span>Visit Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
