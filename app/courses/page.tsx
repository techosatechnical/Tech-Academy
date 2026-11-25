import React from 'react';
import { getCompleteOrganisationData } from '@/lib/services/organisationService';
import { OrganisationShell } from '@/components/layout/OrganisationShell';
import OrgCoursesPage from '../[orgSlug]/courses/page';

export default async function RootCoursesPage() {
  const data = await getCompleteOrganisationData('bright');

  return (
    <OrganisationShell initialData={data} basePath="/bright">
      <OrgCoursesPage />
    </OrganisationShell>
  );
}
