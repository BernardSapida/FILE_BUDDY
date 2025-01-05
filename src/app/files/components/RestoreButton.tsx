import { trpc } from '@/lib/trpc/client';
import {
   Button,
   Divider,
   Modal,
   ModalBody,
   ModalContent,
   ModalHeader,
   useDisclosure
} from '@nextui-org/react';
import { Dispatch, FunctionComponent, SetStateAction, useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { MdOutlineRestore } from 'react-icons/md';
import { toast } from 'sonner';

interface RestoreButtonProps {
   selectedKeys: Set<never>;
   setFiles: Dispatch<SetStateAction<File[]>>;
}

const RestoreButton: FunctionComponent<RestoreButtonProps> = ({ selectedKeys, setFiles }) => {
   const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
   const [loading, setLoading] = useState<boolean>(false);
   const selectedFiles = [...(selectedKeys.values() as any)];
   const fileSize = selectedKeys.size;
   const trashMutation = trpc.file.setFileTrash.useMutation({
      onSuccess: () => {
         setFiles((prevFiles) => {
            if (selectedFiles.length == 0) return prevFiles;

            return prevFiles.filter((file) => {
               if (!selectedFiles.includes(file.asset_id)) return file;
            });
         });
         toast.success('Successfully restored file/s');
         setLoading(false);
         onClose();
      },
      onError: () => {
         toast.error('There was an error, please try again');
         setLoading(false);
      }
   });

   const restoreFiles = () => {
      setLoading(true);

      trashMutation.mutate({ fileIds: selectedFiles, trashed: false });
   };

   return (
      <>
         <Button
            color="primary"
            startContent={<MdOutlineRestore className="text-lg" />}
            variant="flat"
            onPress={onOpen}
            isDisabled={selectedKeys.size == 0}
         >
            Restore
         </Button>
         <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
         >
            <ModalContent>
               {() => (
                  <>
                     <ModalHeader className="flex flex-col gap-1">Restore files</ModalHeader>
                     <Divider />
                     <ModalBody className="py-5">
                        <p>
                           Are you sure you want to restore{' '}
                           <span className="font-semibold text-primary">{fileSize} file/s</span>?
                        </p>
                        <Button
                           type="submit"
                           size="sm"
                           startContent={!loading && <MdOutlineRestore className="text-lg" />}
                           color="primary"
                           className="ml-auto"
                           onPress={restoreFiles}
                           isLoading={loading}
                        >
                           {loading ? 'Restoring...' : 'Restore files'}
                        </Button>
                     </ModalBody>
                  </>
               )}
            </ModalContent>
         </Modal>
      </>
   );
};

export default RestoreButton;
