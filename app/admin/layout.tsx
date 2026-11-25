'use client';

import React, { useState } from 'react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth, AuthProvider } from '@/context/AuthContext';
import { AdminGuard } from '@/components/admin/AdminGuard';
import {
  GraduationCap,
  LayoutDashboard,
  Building2,
  Settings,
  BookOpen,
  Users,
  Image,
  Bell,
  Inbox,
  UserCheck,
  LogOut,
  ExternalLink,
  Menu,
  X,
  FileText,
} from 'lucide-react';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, logout, isSuperAdmin, isOrgAdmin, isEditor } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If on login page, render children directly without admin chrome
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const roleBadgeColor = isSuperAdmin
    ? 'bg-purple-100 text-purple-800 border-purple-200'
    : isOrgAdmin
      ? 'bg-blue-100 text-blue-800 border-blue-200'
      : 'bg-emerald-100 text-emerald-800 border-emerald-200';

  const navItems = [
    {
      title: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
      allowed: true,
    },
    {
      title: 'Organisations',
      href: '/admin/organisations',
      icon: Building2,
      allowed: isSuperAdmin,
      badge: 'Super',
    },
    {
      title: 'Site Settings',
      href: '/admin/settings',
      icon: Settings,
      allowed: !isEditor,
    },
    {
      title: 'Home Content',
      href: '/admin/content/home',
      icon: FileText,
      allowed: true,
    },
    {
      title: 'About Content',
      href: '/admin/content/about',
      icon: FileText,
      allowed: true,
    },
    {
      title: 'Courses',
      href: '/admin/courses',
      icon: BookOpen,
      allowed: true,
    },
    {
      title: 'Faculty / Teachers',
      href: '/admin/teachers',
      icon: Users,
      allowed: true,
    },
    {
      title: 'Photo Gallery',
      href: '/admin/gallery',
      icon: Image,
      allowed: true,
    },
    {
      title: 'Announcements',
      href: '/admin/announcements',
      icon: Bell,
      allowed: true,
    },
    {
      title: 'Admissions & Enquiries',
      href: '/admin/enquiries',
      icon: Inbox,
      allowed: !isEditor,
    },
    {
      title: 'User Management',
      href: '/admin/users',
      icon: UserCheck,
      allowed: isSuperAdmin,
      badge: 'Super',
    },
  ];

  return (
    <AdminGuard>
      <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex md:w-64 flex-col bg-[#0F172A] text-slate-300 border-r border-slate-800 flex-shrink-0">
          {/* Brand header */}
          <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-800">
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white tracking-tight leading-tight">
                TECH ACADEMY
              </div>
              <div className="text-[10px] text-blue-400 font-medium uppercase tracking-wider">
                Management Panel
              </div>
            </div>
          </div>

          {/* User profile card */}
          <div className="p-4 border-b border-slate-800/80 bg-slate-900/60">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white text-xs">
                {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-white truncate">
                  {user?.displayName || 'Administrator'}
                </div>
                <div className="text-[11px] text-slate-400 truncate">{user?.email}</div>
              </div>
            </div>
            <div className="mt-2.5 flex items-center gap-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleBadgeColor}`}>
                {user?.role}
              </span>
              {user?.organisationIds && user.organisationIds.length > 0 && (
                <span className="text-[10px] text-slate-400 truncate">
                  Org: {user.organisationIds.join(', ')}
                </span>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems
              .filter((item) => item.allowed)
              .map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <NextLink
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.title}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                        {item.badge}
                      </span>
                    )}
                  </NextLink>
                );
              })}
          </nav>

          {/* Public site preview & logout */}
          <div className="p-3 border-t border-slate-800 space-y-1">
            <NextLink
              href="/bright"
              target="_blank"
              className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:bg-slate-800/80 hover:text-slate-200 transition-colors"
            >
              <div className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View Bright Academy</span>
              </div>
              <span className="text-[10px] text-slate-500">Live ↗</span>
            </NextLink>
            <NextLink
              href="/excellence"
              target="_blank"
              className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:bg-slate-800/80 hover:text-slate-200 transition-colors"
            >
              <div className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View Excellence Tutorials</span>
              </div>
              <span className="text-[10px] text-slate-500">Live ↗</span>
            </NextLink>
            <button
              onClick={() => logout()}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Mobile Header */}
        <header className="md:hidden bg-[#0F172A] text-white px-4 py-3 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm tracking-tight">Admin Console</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900 text-slate-300 px-4 py-3 border-b border-slate-800 space-y-1">
            <div className="pb-3 mb-2 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400 truncate">{user?.email}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleBadgeColor}`}>
                {user?.role}
              </span>
            </div>
            {navItems
              .filter((item) => item.allowed)
              .map((item) => {
                const Icon = item.icon;
                return (
                  <NextLink
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium hover:bg-slate-800 text-slate-300"
                  >
                    <Icon className="w-4 h-4 text-slate-400" />
                    <span>{item.title}</span>
                  </NextLink>
                );
              })}
            <div className="pt-2 border-t border-slate-800">
              <button
                onClick={() => logout()}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-950/30 rounded-lg"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AuthProvider>
  );
}
