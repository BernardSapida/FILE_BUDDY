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
   setFiles: Dispatch<SetStateAction<File[]>>;
}

const DeleteButton: FunctionComponent<DeleteButtonProps> = ({ selectedKeys, setFiles }) => {
   const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
   const [loading, setLoading] = useState<boolean>(false);
   const selectedFiles = [...(selectedKeys.values() as any)];
   const fileSize = selectedKeys.size;
   const deleteMutation = trpc.file.deleteFiles.useMutation({
      onSuccess: async () => {
         setFiles((prevFiles) => {
            if (selectedFiles.length == 0) return prevFiles;

            return prevFiles.filter((file) => !selectedFiles.includes(file.asset_id));
         });
         await deleteFilesInCloudinary();
         toast.success('Successfully deleted file/s');
         setLoading(false);
         onClose();
      },
      onError: () => {
         toast.error('There was an error, please try again');
         setLoading(false);
      }
   });

   const deleteFiles = () => {
      setLoading(true);
      deleteMutation.mutate({ fileIds: selectedFiles });
   };

   const deleteFilesInCloudinary = async () => {
      const requestOptions: RequestInit = {
         method: 'DELETE',
         body: JSON.stringify({ asset_ids: selectedFiles })
      };

      try {
         const response = await fetch('api/cloudinary', requestOptions);
         const data = await response.json();
         console.log(data);
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
                           <span className="font-semibold text-danger">{fileSize} file/s</span>?
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
