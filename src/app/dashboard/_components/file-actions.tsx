import { useState } from 'react';
import { useMutation } from 'convex/react';

import { Doc, Id } from '../../../../convex/_generated/dataModel';
import { api } from '../../../../convex/_generated/api';

import { FileIcon, MoreVertical, StarIcon, TrashIcon } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import { toast } from '@/components/ui/use-toast';
import { Protect } from '@clerk/nextjs';

function getFileUrl(fileId: Id<'files'>) {
  return `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${fileId}`;
}

export default function FileCardActions({
  file,
  isFavorited,
}: {
  file: Doc<'files'>;
  isFavorited: boolean;
}) {
  const deleteFile = useMutation(api.files.deleteFile);
  const toggleFavoriteFile = useMutation(api.files.toggleFavorite);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  return (
    <>
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This action will mark the file for
              our deletion process. Files are deleted periodically.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await deleteFile({ fileId: file._id });
                toast({
                  variant: 'default',
                  title: 'File deleted',
                  description: 'Your file will be deleted soon.',
                });
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => {
              window.open(getFileUrl(file._id), '_blank');
            }}
          >
            <FileIcon className="w-4 h-4" /> Download
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={async () => {
              await toggleFavoriteFile({ fileId: file._id });
            }}
            className="flex gap-1 items-center cursor-pointer"
          >
            <StarIcon className="w-4 h-4" /> Favorite
          </DropdownMenuItem>
          <Protect role="org:admin" fallback={<></>}>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setIsConfirmOpen(true);
              }}
              className="flex gap-1 text-red-600 items-center cursor-pointer "
            >
              <TrashIcon className="w-4 h-4" /> Delete
            </DropdownMenuItem>
          </Protect>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
