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
import { toast } from 'sonner';

interface TrashButtonProps {
   selectedKeys: Set<never>;
   setFiles: Dispatch<SetStateAction<File[]>>;
}

const TrashButton: FunctionComponent<TrashButtonProps> = ({ selectedKeys, setFiles }) => {
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
         toast.success('Successfully move file/s to trash');
         setLoading(false);
         onClose();
      },
      onError: () => {
         toast.error('There was an error, please try again');
         setLoading(false);
      }
   });

   const addToTrash = () => {
      setLoading(true);
      trashMutation.mutate({ fileIds: selectedFiles, trashed: true });
   };

   return (
      <>
         <Button
            color="danger"
            startContent={<FiTrash2 />}
            onPress={onOpen}
            isDisabled={selectedKeys.size == 0}
         >
            Trash
         </Button>
         <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
         >
            <ModalContent>
               {() => (
                  <>
                     <ModalHeader className="flex flex-col gap-1">Trash files</ModalHeader>
                     <Divider />
                     <ModalBody className="py-5">
                        <p>
                           Are you sure you want to move{' '}
                           <span className="font-semibold text-danger">{fileSize} file/s</span> to
                           trash?
                        </p>
                        <Button
                           type="submit"
                           size="sm"
                           startContent={!loading && <FiTrash2 />}
                           color="danger"
                           className="ml-auto"
                           onPress={addToTrash}
                           isLoading={loading}
                           isDisabled={loading}
                        >
                           {loading ? 'Moving...' : 'Move to trash'}
                        </Button>
                     </ModalBody>
                  </>
               )}
            </ModalContent>
         </Modal>
      </>
   );
};

export default TrashButton;
