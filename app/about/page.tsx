import React from 'react';
import { getCompleteOrganisationData } from '@/lib/services/organisationService';
import { OrganisationShell } from '@/components/layout/OrganisationShell';
import OrgAboutPage from '../[orgSlug]/about/page';

export default async function RootAboutPage() {
  const data = await getCompleteOrganisationData('bright');

  return (
    <OrganisationShell initialData={data} basePath="/bright">
      <OrgAboutPage />
    </OrganisationShell>
  );
}
