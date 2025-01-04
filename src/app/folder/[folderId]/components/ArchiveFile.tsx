import { Button, Tooltip } from '@nextui-org/react';
import { usePathname } from 'next/navigation';
import { Dispatch, FunctionComponent, SetStateAction } from 'react';
import { IoArchiveOutline } from 'react-icons/io5';
import { BsArchive } from 'react-icons/bs';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc/client';

interface ArchiveFileProps {
   fileId: string;
   setFiles: Dispatch<SetStateAction<File[]>>;
}

const ArchiveFile: FunctionComponent<ArchiveFileProps> = ({ fileId, setFiles }) => {
   const pathname = usePathname();
   const archivePath = pathname === '/archives';
   const archiveMutation = trpc.file.setFolderArchive.useMutation({
      onSuccess: () => {
         setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
         toast.success(`Successfully ${archivePath ? 'unarchived' : 'archived'} file`);
      },
      onError: () => {
         toast.error('There was an error, please try again');
      }
   });

   const archiveFile = async () => {
      archiveMutation.mutate({ fileId, archived: !archivePath });
   };

   return (
      <Tooltip content={archivePath ? 'Unarchive' : 'Archive'}>
         <Button
            isIconOnly
            size="sm"
            variant="light"
            className="text-base text-default-400"
            onPress={archiveFile}
            startContent={
               archivePath ? (
                  <BsArchive className="text-lg" />
               ) : (
                  <IoArchiveOutline className="text-xl" />
               )
            }
         />
      </Tooltip>
   );
};

export default ArchiveFile;
