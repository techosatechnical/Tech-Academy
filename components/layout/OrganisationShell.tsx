'use client';

import React from 'react';
import { CompleteOrganisationData } from '@/data/sampleOrganisations';
import { OrganisationProvider } from '@/context/OrganisationContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

interface OrganisationShellProps {
  initialData: CompleteOrganisationData;
  basePath?: string;
  children: React.ReactNode;
}

export const OrganisationShell: React.FC<OrganisationShellProps> = ({
  initialData,
  basePath,
  children,
}) => {
  const { theme } = initialData.organisation;

  const styleVariables = {
    '--theme-primary': theme.primaryColor,
    '--theme-secondary': theme.secondaryColor,
    '--theme-navy': theme.darkNavyColor,
    '--theme-light-blue': theme.lightBlueColor,
    '--theme-light-bg': theme.lightBgColor,
  } as React.CSSProperties;

  return (
    <OrganisationProvider initialData={initialData} basePath={basePath}>
      <div style={styleVariables} className="min-h-screen flex flex-col bg-white text-[#334155] antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </OrganisationProvider>
  );
};
