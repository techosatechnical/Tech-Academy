import React from 'react';
import { getCompleteOrganisationData } from '@/lib/services/organisationService';
import { OrganisationShell } from '@/components/layout/OrganisationShell';
import OrgHomePage from './[orgSlug]/page';

export default async function RootHomePage() {
  const data = await getCompleteOrganisationData('bright');

  return (
    <OrganisationShell initialData={data} basePath="/bright">
      <OrgHomePage />
    </OrganisationShell>
  );
}
