import React from 'react';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { getCompleteOrganisationData, getOrganisationBySlug } from '@/lib/services/organisationService';
import { OrganisationShell } from '@/components/layout/OrganisationShell';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface OrgLayoutProps {
  children: React.ReactNode;
  params: Promise<{ orgSlug: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ orgSlug: string }>;
}): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const orgSlug = resolvedParams?.orgSlug || 'bright';
    const org = await getOrganisationBySlug(orgSlug);

    if (!org) {
      return {
        title: 'Tuition Centre Platform',
      };
    }

    return {
      title: {
        default: `${org.name || 'Academy'} | ${org.tagline || 'Education'}`,
        template: `%s | ${org.name || 'Academy'}`,
      },
      description: `${org.name || 'Academy'} - ${org.tagline || 'Premier Tuition'}. Contact: ${org.contact?.phone || ''}`,
    };
  } catch {
    return {
      title: 'Tuition Centre Platform',
    };
  }
}

export default async function OrgLayout({ children, params }: OrgLayoutProps) {
  const resolvedParams = await params;
  const orgSlug = resolvedParams?.orgSlug || 'bright';
  const org = await getOrganisationBySlug(orgSlug);

  if (!org) {
    notFound();
  }

  const completeData = await getCompleteOrganisationData(orgSlug);

  let isCustomDomain = false;
  try {
    const headerList = await headers();
    isCustomDomain = headerList.get('x-custom-domain') === 'true';
  } catch {
    isCustomDomain = false;
  }

  const basePath = isCustomDomain ? '' : `/${orgSlug}`;

  return (
    <OrganisationShell initialData={completeData} basePath={basePath}>
      {children}
    </OrganisationShell>
  );
}
