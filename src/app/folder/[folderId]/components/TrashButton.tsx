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
   const selectedAllFiles = selectedKeys.toString() == 'all';
   const fileSize = selectedKeys.size;

   const addToTrash = () => {
      setLoading(true);

      toast.promise(new Promise((resolve) => setTimeout(() => resolve({}), 1000)), {
         loading: 'Moving file/s to trash...',
         success: () => {
            setFiles((prevFiles) => {
               if (selectedAllFiles) return [];

               return prevFiles.filter((file) => {
                  if (![...(selectedKeys.values() as any)].includes(file.id)) return file;
               });
            });

            return 'Successfully move file/s to trash!';
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
            color="danger"
            startContent={<FiTrash2 />}
            variant="flat"
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
                           <span className="font-semibold text-danger">
                              {selectedAllFiles ? 'all' : fileSize} file/s
                           </span>{' '}
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
