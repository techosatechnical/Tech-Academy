'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useOrganisation } from '@/context/OrganisationContext';
import { GraduationCap, Menu, X, Phone, Mail, Clock, ChevronRight, Lock } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { organisation, settings, basePath } = useOrganisation();

  const navLinks = [
    { label: 'Home', href: basePath || '/' },
    { label: 'About', href: `${basePath}/about` },
    { label: 'Courses', href: `${basePath}/courses` },
    { label: 'Faculty', href: `${basePath}/faculty` },
    { label: 'Admission', href: `${basePath}/admission` },
    { label: 'Results', href: `${basePath}/results` },
    { label: 'Gallery', href: `${basePath}/gallery` },
    { label: 'Contact', href: `${basePath}/contact` },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full transition-shadow duration-200">
      {/* Top Academic Bar */}
      <div className="bg-theme-navy text-slate-200 text-xs py-2 px-4 border-b border-white/10 hidden sm:block">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-white/90 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {settings.admissionNotice || 'Admissions Open 2026–2027 Batches'}
            </span>
            <span className="hidden md:flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-white/70" />
              {organisation.contact.workingHours}
            </span>
          </div>

          <div className="flex items-center gap-6 text-slate-300">
            <a
              href={`tel:${organisation.contact.phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-white/70" />
              <span>{organisation.contact.phone}</span>
            </a>
            <a
              href={`mailto:${organisation.contact.email}`}
              className="hidden lg:flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-white/70" />
              <span>{organisation.contact.email}</span>
            </a>

            {/* Staff Portal Link */}
            <Link
              href="/admin/login"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white font-medium transition-colors text-[11px] border border-white/15"
            >
              <Lock className="w-3 h-3 text-white/70" />
              <span>Staff Portal</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`bg-white transition-all duration-300 border-b border-slate-200 ${
          isScrolled ? 'shadow-md py-3' : 'py-3.5 sm:py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href={basePath || '/'} className="flex items-center gap-3 group">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg bg-theme-primary flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-theme-navy leading-tight group-hover:text-theme-primary transition-colors">
                {organisation.name.toUpperCase()}
              </span>
              <span className="text-[10px] sm:text-xs font-semibold tracking-widest text-theme-secondary uppercase">
                {organisation.tagline}
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive =
                link.href === basePath || link.href === '/'
                  ? pathname === link.href
                  : pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200 relative ${
                    isActive
                      ? 'text-theme-primary bg-theme-light font-bold'
                      : 'text-slate-700 hover:text-theme-primary hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-theme-primary rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Action CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href={`${basePath}/admission`}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-bold rounded-md bg-theme-primary text-white hover:bg-theme-navy shadow-sm hover:shadow transition-all duration-200"
            >
              Apply Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href={`${basePath}/admission`}
              className="px-3 py-1.5 text-xs font-bold rounded-md bg-theme-primary text-white hover:bg-theme-navy transition-colors"
            >
              Apply
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-slate-700 hover:text-theme-primary hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-theme-primary"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white shadow-lg animate-in fade-in duration-200">
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              {/* Mobile Organisation Selector */}
              <div className="flex items-center justify-between p-2 mb-2 bg-slate-50 rounded-md border border-slate-200 text-xs">
                <span className="font-bold text-slate-700">Centre: {organisation.name}</span>
                <div className="flex items-center gap-2">
                  <Link
                    href="/bright"
                    onClick={() => setIsOpen(false)}
                    className="px-2 py-1 rounded bg-blue-100 text-blue-900 font-bold text-[11px]"
                  >
                    Bright
                  </Link>
                  <Link
                    href="/excellence"
                    onClick={() => setIsOpen(false)}
                    className="px-2 py-1 rounded bg-orange-100 text-orange-900 font-bold text-[11px]"
                  >
                    Excellence
                  </Link>
                </div>
              </div>

              {navLinks.map((link) => {
                const isActive =
                  link.href === basePath || link.href === '/'
                    ? pathname === link.href
                    : pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-md text-base font-semibold transition-colors ${
                      isActive
                        ? 'bg-theme-light text-theme-primary font-bold border-l-4 border-theme-primary'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-theme-primary'
                    }`}
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                );
              })}

              <div className="pt-4 border-t border-slate-100 space-y-2">
                <Link
                  href={`${basePath}/admission`}
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center py-2.5 px-4 rounded-md bg-theme-primary text-white font-bold hover:bg-theme-navy transition-colors shadow-sm"
                >
                  Apply for Admission
                </Link>
                <div className="flex flex-col gap-1.5 pt-2 text-xs text-slate-500 px-1">
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-theme-primary" />
                    {organisation.contact.phone}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-theme-primary" />
                    {organisation.contact.email}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
