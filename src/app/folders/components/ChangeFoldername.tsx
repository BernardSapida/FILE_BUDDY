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
import { Dispatch, FunctionComponent, SetStateAction } from 'react';
import { CiEdit } from 'react-icons/ci';
import { IoCheckmark } from 'react-icons/io5';
import { toast } from 'sonner';

interface ChangeFoldernameProps {
   folderId: string;
   folderName: string;
   setFolders: Dispatch<SetStateAction<Folder[]>>;
}

const ChangeFoldername: FunctionComponent<ChangeFoldernameProps> = ({
   folderId,
   folderName,
   setFolders
}) => {
   const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

   const onSubmit = (e: any) => {
      e.preventDefault();

      const data = Object.fromEntries(new FormData(e.currentTarget)) as { folderName: string };

      toast.promise(new Promise((resolve) => setTimeout(() => resolve({}), 1000)), {
         loading: 'Changing folder name...',
         success: () => {
            setFolders((prevFolders) =>
               prevFolders.map((folder) =>
                  folder.id === folderId ? { ...folder, folder_name: data.folderName } : folder
               )
            );

            return 'Successfully changed folder name!';
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
            isIconOnly
            size="sm"
            variant="light"
            className="text-base text-default-400"
            onPress={onOpen}
            startContent={<CiEdit className="text-xl" />}
         />
         <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
         >
            <ModalContent>
               {() => (
                  <>
                     <ModalHeader className="flex flex-col gap-1">Rename Folder</ModalHeader>
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
                              defaultValue={folderName}
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
                              startContent={<IoCheckmark className="text-xl" />}
                              color="primary"
                              className="ml-auto"
                           >
                              Save
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

export default ChangeFoldername;
