import React from 'react';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { getCompleteOrganisationData, getOrganisationBySlug } from '@/lib/services/organisationService';
import { OrganisationShell } from '@/components/layout/OrganisationShell';
import type { Metadata } from 'next';

interface OrgLayoutProps {
  children: React.ReactNode;
  params: Promise<{ orgSlug: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ orgSlug: string }>;
}): Promise<Metadata> {
  const { orgSlug } = await params;
  const org = await getOrganisationBySlug(orgSlug);

  if (!org) {
    return {
      title: 'Organisation Not Found',
    };
  }

  return {
    title: {
      default: `${org.name} | ${org.tagline}`,
      template: `%s | ${org.name}`,
    },
    description: `${org.name} - ${org.tagline}. Professional tuition & coaching center. Contact: ${org.contact.phone}`,
  };
}

export default async function OrgLayout({ children, params }: OrgLayoutProps) {
  const { orgSlug } = await params;
  const org = await getOrganisationBySlug(orgSlug);

  if (!org) {
    notFound();
  }

  const completeData = await getCompleteOrganisationData(orgSlug);
  const headerList = await headers();
  const isCustomDomain = headerList.get('x-custom-domain') === 'true';
  const basePath = isCustomDomain ? '' : `/${orgSlug}`;

  return (
    <OrganisationShell initialData={completeData} basePath={basePath}>
      {children}
    </OrganisationShell>
  );
}
