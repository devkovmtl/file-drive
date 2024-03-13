'use client';

import Image from 'next/image';
import UploadButton from '../_components/upload-button';
import FileCard from '../_components/file-card';
import { useOrganization, useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Loader2 } from 'lucide-react';
import SearchBar from '../_components/search-bar';
import { useState } from 'react';

function Placeholder() {
  return (
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
  );
}

export default function FilesPage() {
  const organization = useOrganization();
  const user = useUser();
  const [query, setQuery] = useState('');

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const files = useQuery(api.files.getFiles, orgId ? { orgId, query } : 'skip');
  const isLoading = files === undefined;

  return (
    <main className="container mx-auto">
      {isLoading && (
        <div className="flex flex-col gap-8 items-center mt-12">
          <Loader2 className="h-32 w-32 animate-spin text-gray-500" />
          Loading your image...
        </div>
      )}

      {!isLoading && (
        <>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold">Your Files</h1>
            <SearchBar query={query} setQuery={setQuery} />
            <UploadButton />
          </div>

          {!isLoading && !query && files.length === 0 && (
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

          <div className="grid grid-cols-3 gap-4">
            {files?.map((file) => {
              return <FileCard key={file._id} file={file} />;
            })}
          </div>
        </>
      )}
    </main>
  );
}
