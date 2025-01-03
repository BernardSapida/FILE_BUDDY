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
   const selectedAllFolders = selectedKeys.toString() == 'all';
   const folderSize = selectedKeys.size;

   const deleteFolders = () => {
      setLoading(true);

      toast.promise(new Promise((resolve) => setTimeout(() => resolve({}), 1000)), {
         loading: 'Deleting folder/s...',
         success: () => {
            setFolders((prevFolders) => {
               if (selectedAllFolders) return [];

               return prevFolders.filter((folder) => {
                  if (![...(selectedKeys.values() as any)].includes(folder.id)) return folder;
               });
            });

            setLoading(false);

            return 'Successfully deleted folder/s!';
         },
         error: () => {
            setLoading(false);

            return 'There was an error, please try again';
         }
      });

      onClose();
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
                           <span className="font-semibold text-danger">
                              {selectedAllFolders ? 'all' : folderSize} folder/s
                           </span>
                           ?
                        </p>
                        <Button
                           type="submit"
                           size="sm"
                           startContent={!loading && <FiTrash2 />}
                           color="danger"
                           className="ml-auto"
                           onPress={deleteFolders}
                           isLoading={loading}
                        >
                           {loading ? 'Deleting...' : 'Delete folders'}
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
