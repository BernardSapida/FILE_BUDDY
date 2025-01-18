import { trpc } from '@/lib/trpc/client';
import { Form } from '@nextui-org/form';
import {
   Button,
   Divider,
   Input,
   Modal,
   ModalBody,
   ModalContent,
   ModalHeader,
   useDisclosure
} from '@nextui-org/react';
import { Dispatch, FunctionComponent, SetStateAction, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { MdCreate } from 'react-icons/md';
import { toast } from 'sonner';

interface CreateFolderModalProps {
   setFolders: Dispatch<SetStateAction<Folder[]>>;
}

const CreateFolderModal: FunctionComponent<CreateFolderModalProps> = ({ setFolders }) => {
   const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
   const [loading, setLoading] = useState<boolean>(false);
   const createMutation = trpc.folder.createFolder.useMutation({
      onSuccess: (folder) => {
         setFolders((prevFolders) => [
            {
               id: folder.id,
               folder_name: folder.folder_name,
               files: [],
               bytes: 0,
               favorited: false,
               trashed: false,
               createdAt: new Date(),
               updatedAt: new Date()
            } as any,
            ...prevFolders
         ]);
         setLoading(false);
         toast.success('Successfully created folder');
         onClose();
      },
      onError: (error) => {
         toast.error('Folder name should be unique');
         setLoading(false);
      }
   });

   const onSubmit = (e: any) => {
      e.preventDefault();

      setLoading(true);

      const data = Object.fromEntries(new FormData(e.currentTarget)) as { folderName: string };
      createMutation.mutate({ folder_name: data.folderName });
   };

   return (
      <>
         <Button
            color="primary"
            startContent={<FaPlus />}
            variant="solid"
            onPress={onOpen}
         >
            Create folder
         </Button>
         <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="center"
         >
            <ModalContent>
               {() => (
                  <>
                     <ModalHeader className="flex flex-col gap-1">Create Folder</ModalHeader>
                     <Divider />
                     <ModalBody className="py-5">
                        <Form
                           validationBehavior="native"
                           onSubmit={onSubmit}
                           className="space-y-2"
                        >
                           <Input
                              type="text"
                              name="folderName"
                              placeholder="Folder name"
                              aria-label="Foldername input"
                              validate={(value) => {
                                 if (!value) return 'Folder name is required';
                              }}
                              isRequired
                           />
                           <Button
                              type="submit"
                              size="sm"
                              startContent={!loading && <MdCreate />}
                              color="primary"
                              className="ml-auto"
                              isLoading={loading}
                              isDisabled={loading}
                           >
                              {loading ? 'Creating folder...' : 'Create'}
                           </Button>
                        </Form>
                     </ModalBody>
                  </>
               )}
            </ModalContent>
         </Modal>
      </>
   );
};

export default CreateFolderModal;
