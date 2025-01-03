import { Button, Tooltip } from '@nextui-org/react';
import { usePathname } from 'next/navigation';
import { Dispatch, FunctionComponent, SetStateAction } from 'react';
import { IoArchiveOutline } from 'react-icons/io5';
import { BsArchive } from 'react-icons/bs';
import { toast } from 'sonner';

interface ArchiveFileProps {
   fileId: string;
   setFiles: Dispatch<SetStateAction<File[]>>;
}

const ArchiveFile: FunctionComponent<ArchiveFileProps> = ({ fileId, setFiles }) => {
   const pathname = usePathname();
   const archivePath = pathname === '/archives';

   const archiveFile = async () => {
      toast.promise(new Promise((resolve) => setTimeout(() => resolve({}), 1000)), {
         loading: 'Archiving file...',
         success: () => {
            setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
            return `Successfully ${archivePath ? 'unarchived' : 'archived'} file!`;
         },
         error: () => {
            return 'There was an error, please try again';
         }
      });
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
