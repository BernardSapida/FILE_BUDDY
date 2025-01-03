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
   const selectedAllFolders = selectedKeys.toString() == 'all';
   const folderSize = selectedKeys.size;

   const restoreFolders = () => {
      setLoading(true);

      toast.promise(new Promise((resolve) => setTimeout(() => resolve({}), 1000)), {
         loading: 'Restoring folder/s...',
         success: () => {
            setFolders((prevFolders) => {
               if (selectedAllFolders) return [];

               return prevFolders.filter((folder) => {
                  if (![...(selectedKeys.values() as any)].includes(folder.id)) return folder;
               });
            });
            setLoading(false);

            return 'Successfully restored folder/s!';
         },
         error: () => {
            return 'There was an error, please try again';
         }
      });

      onClose();
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
                           <span className="font-semibold text-primary">
                              {selectedAllFolders ? 'all' : folderSize} folder/s
                           </span>
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
                           {loading ? 'Restoring...' : 'Restore folders'}
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
