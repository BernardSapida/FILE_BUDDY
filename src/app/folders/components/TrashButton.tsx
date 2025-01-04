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
   setFolders: Dispatch<SetStateAction<Folder[]>>;
}

const TrashButton: FunctionComponent<TrashButtonProps> = ({ selectedKeys, setFolders }) => {
   const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
   const [loading, setLoading] = useState<boolean>(false);
   const selectedFolders = [...(selectedKeys.values() as any)];
   const folderSize = selectedKeys.size;
   const trashMutation = trpc.folder.setFolderTrash.useMutation({
      onSuccess: () => {
         setFolders((prevFolders) => {
            if (selectedFolders.length == 0) return prevFolders;

            return prevFolders.filter((folder) => {
               if (!selectedFolders.includes(folder.id)) return folder;
            });
         });
         toast.success('Successfully move folder/s to trash');
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
      trashMutation.mutate({ folderIds: selectedFolders, trashed: true });
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
                     <ModalHeader className="flex flex-col gap-1">Trash folders</ModalHeader>
                     <Divider />
                     <ModalBody className="py-5">
                        <p>
                           Are you sure you want to move{' '}
                           <span className="font-semibold text-danger">{folderSize} folder/s</span>{' '}
                           to trash?
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
                           {loading ? 'Moving to trash...' : 'Move to trash'}
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
