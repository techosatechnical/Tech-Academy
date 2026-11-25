'use client';

import React from 'react';
import { useOrganisation } from '@/context/OrganisationContext';
import { PageHeader } from '@/components/layout/PageHeader';
import { GalleryGrid } from '@/components/gallery/GalleryGrid';

export default function OrgGalleryPage() {
  const { organisation } = useOrganisation();

  return (
    <>
      <PageHeader
        title={`${organisation.name} Campus Gallery`}
        subtitle="Explore our academic facilities, classroom sessions, technology labs, and student celebrations."
        breadcrumbs={[{ label: 'Gallery' }]}
      />
      <GalleryGrid />
    </>
  );
}
