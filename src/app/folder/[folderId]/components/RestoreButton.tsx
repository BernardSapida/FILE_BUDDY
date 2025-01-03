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
   const selectedAllFiles = selectedKeys.toString() == 'all';
   const fileSize = selectedKeys.size;

   const restoreFiles = () => {
      setLoading(true);

      toast.promise(new Promise((resolve) => setTimeout(() => resolve({}), 1000)), {
         loading: 'Restoring file/s...',
         success: () => {
            setFiles((prevFiles) => {
               if (selectedAllFiles) return [];

               return prevFiles.filter((file) => {
                  if (![...(selectedKeys.values() as any)].includes(file.id)) return file;
               });
            });

            return 'Successfully restored file/s!';
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
                     <ModalHeader className="flex flex-col gap-1">Restore files</ModalHeader>
                     <Divider />
                     <ModalBody className="py-5">
                        <p>
                           Are you sure you want to restore{' '}
                           <span className="font-semibold text-primary">
                              {selectedAllFiles ? 'all' : fileSize} file/s
                           </span>
                           ?
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
