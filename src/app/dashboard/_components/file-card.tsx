import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Doc, Id } from '../../../../convex/_generated/dataModel';
import { Button } from '@/components/ui/button';
import {
  DeleteIcon,
  FileTextIcon,
  GanttChartIcon,
  ImageIcon,
  MoreVertical,
  StarIcon,
  Trash,
  TrashIcon,
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { toast } from '@/components/ui/use-toast';
import { toggleFavorite } from '../../../../convex/files';

function FileCardActions({ file }: { file: Doc<'files'> }) {
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
                // TODO: delete file
                await deleteFile({ fileId: file._id });
                toast({
                  variant: 'default',
                  title: 'File deleted',
                  description: 'Your file has been deleted',
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
            onClick={async () => {
              await toggleFavoriteFile({ fileId: file._id });
            }}
          >
            <StarIcon className="w-4 h-4" /> Favorite
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setIsConfirmOpen(true);
            }}
            className="flex gap-1 text-red-600 items-center cursor-pointer "
          >
            <TrashIcon className="w-4 h-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

function getFileUrl(fileId: Id<'files'>) {
  return `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${fileId}`;
}

export default function FileCard({
  file,
  isFavorited,
}: { file: Doc<'files'> } & { isFavorited?: boolean }) {
  const typeIcons = {
    image: <ImageIcon />,
    pdf: <FileTextIcon />,
    csv: <GanttChartIcon />,
  };

  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle className="flex gap-2 text-base font-normal">
          <div className="flex justify-center">{typeIcons[file.type]}</div>{' '}
          {file.name}
        </CardTitle>
        <div className="absolute top-2 right-2">
          <FileCardActions file={file} />
        </div>
      </CardHeader>
      <CardContent className="h-[200px] flex justify-center items-center">
        {file.type === 'image' && (
          <Image
            alt={file.name}
            width={200}
            height={100}
            src={getFileUrl(file._id)}
          />
        )}

        {file.type === 'csv' && <GanttChartIcon className="w-24 h-24" />}

        {file.type === 'pdf' && <FileTextIcon className="w-24 h-24" />}
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button
          onClick={() => {
            // Open a new tab to file location on convex
            window.open(getFileUrl(file._id), '_blank');
          }}
        >
          Download
        </Button>
      </CardFooter>
    </Card>
  );
}
