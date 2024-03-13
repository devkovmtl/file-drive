'use client';

import Image from 'next/image';
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
      {files && files.length === 0 && (
        <div className="flex flex-col gap-8 items-center mt-12">
          <Image
            alt="an image of a picture and directory icon"
            width={300}
            height={300}
            src="/empty.svg"
          />
          <div className="text-2xl">You have no files, upload one now</div>
          <UploadButton />
        </div>
      )}

      {files && files.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold">Your Files</h1>
            <UploadButton />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {files?.map((file) => {
              return <FileCard key={file._id} file={file} />;
            })}
          </div>
        </>
      )}
    </main>
  );
}
