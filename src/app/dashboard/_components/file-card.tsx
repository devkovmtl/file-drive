import Image from 'next/image';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Doc, Id } from '../../../../convex/_generated/dataModel';
import { Button } from '@/components/ui/button';
import { FileTextIcon, GanttChartIcon, ImageIcon } from 'lucide-react';
import FileCardActions from './file-actions';

function getFileUrl(fileId: Id<'files'>) {
  return `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${fileId}`;
}

export default function FileCard({
  file,
  isFavorited,
}: { file: Doc<'files'> } & { isFavorited: boolean }) {
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
          <FileCardActions file={file} isFavorited={isFavorited} />
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
