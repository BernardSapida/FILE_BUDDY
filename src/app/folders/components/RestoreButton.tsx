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
import { MdOutlineRestore } from 'react-icons/md';
import { toast } from 'sonner';

interface RestoreButtonProps {
   selectedKeys: Set<never>;
   setFolders: Dispatch<SetStateAction<Folder[]>>;
}

const RestoreButton: FunctionComponent<RestoreButtonProps> = ({ selectedKeys, setFolders }) => {
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
         toast.success('Successfully restored folder/s');
         setLoading(false);
         onClose();
      },
      onError: () => {
         toast.error('There was an error, please try again');
         setLoading(false);
      }
   });

   const restoreFolders = () => {
      setLoading(true);
      trashMutation.mutate({ folderIds: selectedFolders, trashed: false });
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
                     <ModalHeader className="flex flex-col gap-1">Restore folders</ModalHeader>
                     <Divider />
                     <ModalBody className="py-5">
                        <p>
                           Are you sure you want to restore{' '}
                           <span className="font-semibold text-primary">{folderSize} folder/s</span>
                           ?
                        </p>
                        <Button
                           type="submit"
                           size="sm"
                           startContent={!loading && <MdOutlineRestore className="text-lg" />}
                           color="primary"
                           className="ml-auto"
                           onPress={restoreFolders}
                           isLoading={loading}
                        >
                           {loading ? 'Restoring folders...' : 'Restore folders'}
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
