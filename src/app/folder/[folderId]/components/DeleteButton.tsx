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
   setFiles: Dispatch<SetStateAction<File[]>>;
}

const DeleteButton: FunctionComponent<DeleteButtonProps> = ({ selectedKeys, setFiles }) => {
   const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
   const [loading, setLoading] = useState<boolean>(false);
   const selectedAllFiles = selectedKeys.toString() === 'all';
   const fileSize = selectedKeys.size;

   const deleteFiles = () => {
      setLoading(true);

      toast.promise(deleteFilesInCloudinary, {
         loading: 'Deleting file/s...',
         success: () => {
            setFiles((prevFiles) => {
               if (selectedAllFiles) return [];

               return prevFiles.filter(
                  (file) => ![...(selectedKeys.values() as any)].includes(file.asset_id)
               );
            });
            setLoading(false);

            return 'Successfully deleted file/s!';
         },
         error: () => {
            setLoading(false);
            return 'There was an error, please try again';
         }
      });

      onClose();
   };

   const deleteFilesInCloudinary = async () => {
      const requestOptions: RequestInit = {
         method: 'DELETE',
         body: JSON.stringify({ asset_ids: [...(selectedKeys.values() as any)] })
      };

      try {
         const response = await fetch('api/cloudinary', requestOptions);
         const data = await response.json();
      } catch (error) {
         console.error('Error downloading file:', error);
      }
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
                     <ModalHeader className="flex flex-col gap-1">Delete files</ModalHeader>
                     <Divider />
                     <ModalBody className="py-5">
                        <p>
                           Are you sure you want to delete{' '}
                           <span className="font-semibold text-danger">
                              {selectedAllFiles ? 'all' : fileSize} file/s
                           </span>
                           ?
                        </p>
                        <Button
                           type="submit"
                           size="sm"
                           startContent={!loading && <FiTrash2 />}
                           color="danger"
                           className="ml-auto"
                           onPress={deleteFiles}
                           isLoading={loading}
                        >
                           {loading ? 'Deleting...' : 'Delete files'}
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
