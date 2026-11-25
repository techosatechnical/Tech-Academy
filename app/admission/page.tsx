import React from 'react';
import { getCompleteOrganisationData } from '@/lib/services/organisationService';
import { OrganisationShell } from '@/components/layout/OrganisationShell';
import OrgAdmissionPage from '../[orgSlug]/admission/page';

export default async function RootAdmissionPage() {
  const data = await getCompleteOrganisationData('bright');

  return (
    <OrganisationShell initialData={data} basePath="/bright">
      <OrgAdmissionPage />
    </OrganisationShell>
  );
}
