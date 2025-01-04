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

   const onSubmit = (e: any) => {
      e.preventDefault();

      setLoading(true);

      const data = Object.fromEntries(new FormData(e.currentTarget)) as { folderName: string };

      toast.promise(new Promise((resolve) => setTimeout(() => resolve({}), 1000)), {
         loading: 'Creating folder...',
         success: () => {
            setFolders((prevFolders) => [
               {
                  id: new Date().toString(),
                  folder_name: data.folderName,
                  files: [],
                  favorited: false,
                  trashed: false,
                  createdAt: new Date(),
                  updatedAt: new Date()
               } as any,
               ...prevFolders
            ]);
            setLoading(false);
            onClose();

            return 'Successfully created folder!';
         },
         error: () => {
            return 'There was an error, please try again';
         }
      });
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
