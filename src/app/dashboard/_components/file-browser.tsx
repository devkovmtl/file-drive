'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useOrganization, useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';

import { Doc } from '../../../../convex/_generated/dataModel';
import { api } from '../../../../convex/_generated/api';

import UploadButton from './upload-button';
import SearchBar from './search-bar';

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

export default function FileBrowser({
  title,
  favoritesOnly,
  deletedOnly,
}: {
  title: string;
  favoritesOnly?: boolean;
  deletedOnly?: boolean;
}) {
  const organization = useOrganization();
  const user = useUser();
  const [query, setQuery] = useState('');
  const [type, setType] = useState<Doc<'files'>['type'] | 'all'>('all');

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const favorites = useQuery(
    api.files.getAllFavorites,
    orgId ? { orgId } : 'skip'
  );

  const files = useQuery(
    api.files.getFiles,
    orgId
      ? {
          orgId,
          type: type === 'all' ? undefined : type,
          query,
          favorites: favoritesOnly,
          deletedOnly,
        }
      : 'skip'
  );

  const isLoading = files === undefined;

  const mofdifiedFiles =
    files?.map((file) => ({
      ...file,
      isFavorited: (favorites ?? []).some(
        (favorite) => favorite.fileId === file._id
      ),
    })) ?? [];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl">{title}</h1>

        <SearchBar query={query} setQuery={setQuery} />

        <UploadButton />
      </div>

      {files?.length === 0 && <Placeholder />}
    </div>
  );
}
