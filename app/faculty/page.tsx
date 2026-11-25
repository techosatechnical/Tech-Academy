import React from 'react';
import { getCompleteOrganisationData } from '@/lib/services/organisationService';
import { OrganisationShell } from '@/components/layout/OrganisationShell';
import OrgFacultyPage from '../[orgSlug]/faculty/page';

export default async function RootFacultyPage() {
  const data = await getCompleteOrganisationData('bright');

  return (
    <OrganisationShell initialData={data} basePath="/bright">
      <OrgFacultyPage />
    </OrganisationShell>
  );
}
