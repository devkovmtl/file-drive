'use client';

import { Button } from '@/components/ui/button';
import { useOrganization, useUser } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

export default function Home() {
  const organization = useOrganization();
  const user = useUser();

  let orgId: string | undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  console.log(orgId); // associate to our data
  const createFile = useMutation(api.files.createFile);
  const files = useQuery(api.files.getFiles, orgId ? { orgId } : 'skip');

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {files?.map((file) => {
        return (
          <div key={file._id}>
            <p>{file.name}</p>
          </div>
        );
      })}

      <Button
        onClick={() => {
          if (!orgId) {
            return;
          }
          createFile({ name: 'test', orgId });
        }}
      >
        Create File
      </Button>
    </main>
  );
}
