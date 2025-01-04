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

interface DeleteButtonProps {
   selectedKeys: Set<never>;
   setFolders: Dispatch<SetStateAction<Folder[]>>;
}

const DeleteButton: FunctionComponent<DeleteButtonProps> = ({ selectedKeys, setFolders }) => {
   const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
   const [loading, setLoading] = useState<boolean>(false);
   const selectedFolders = [...(selectedKeys.values() as any)];
   const folderSize = selectedKeys.size;
   const deleteMutation = trpc.folder.deleteFolders.useMutation({
      onSuccess: () => {
         setFolders((prevFolders) => {
            if (selectedFolders.length == 0) return prevFolders;

            return prevFolders.filter((folder) => {
               if (!selectedFolders.includes(folder.id)) return folder;
            });
         });
         toast.success('Successfully deleted folder/s');
         setLoading(false);
         onClose();
      },
      onError: () => {
         toast.error('There was an error, please try again');
         setLoading(false);
      }
   });

   const deleteFolders = () => {
      setLoading(true);
      deleteMutation.mutate({ folderIds: selectedFolders });
   };

   return (
      <>
         <Button
            color="danger"
            startContent={<FiTrash2 />}
            variant="flat"
            onPress={onOpen}
            isDisabled={selectedKeys.size == 0}
         >
            Delete
         </Button>
         <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
         >
            <ModalContent>
               {() => (
                  <>
                     <ModalHeader className="flex flex-col gap-1">Delete folders</ModalHeader>
                     <Divider />
                     <ModalBody className="py-5">
                        <p>
                           Are you sure you want to delete{' '}
                           <span className="font-semibold text-danger">{folderSize} folder/s</span>?
                        </p>
                        <Button
                           type="submit"
                           size="sm"
                           startContent={!loading && <FiTrash2 />}
                           color="danger"
                           className="ml-auto"
                           onPress={deleteFolders}
                           isDisabled={loading}
                           isLoading={loading}
                        >
                           {loading ? 'Deleting folders...' : 'Delete folders'}
                        </Button>
                     </ModalBody>
                  </>
               )}
            </ModalContent>
         </Modal>
      </>
   );
};

export default DeleteButton;
