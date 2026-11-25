'use client';

import React from 'react';
import { useOrganisation } from '@/context/OrganisationContext';
import { Bell, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const AnnouncementsBanner: React.FC = () => {
  const { announcements, basePath } = useOrganisation();
  const activeAnnouncements = announcements.filter((a) => a.isActive);

  if (!activeAnnouncements || activeAnnouncements.length === 0) return null;

  const latest = activeAnnouncements[0];

  return (
    <div className="bg-theme-navy text-white border-b border-white/10 py-2.5 px-4 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold bg-theme-primary text-white shrink-0">
            <Bell className="w-3 h-3 animate-pulse" />
            {latest.badge || 'Announcement'}
          </span>
          <span className="font-medium text-white/95">
            <strong>{latest.title}:</strong> {latest.content}
          </span>
        </div>
        <Link
          href={`${basePath}/admission`}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-white hover:underline shrink-0"
        >
          <span>Enroll Today</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};
