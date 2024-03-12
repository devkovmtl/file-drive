'use client';

import UploadButton from '../_components/upload-button';
import FileCard from '../_components/file-card';
import { useOrganization, useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';

export default function FilesPage() {
  const organization = useOrganization();
  const user = useUser();

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const files = useQuery(api.files.getFiles, orgId ? { orgId } : 'skip');

  return (
    <main className="container mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Your Files</h1>
        <UploadButton />
      </div>
      <div className="grid grid-cols-4 gap-4">
        {files?.map((file) => {
          return <FileCard key={file._id} file={file} />;
        })}
      </div>
    </main>
  );
}
