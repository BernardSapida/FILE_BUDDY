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
   const [loading, setLoading] = useState<boolean>(false);
   const changeMutation = trpc.folder.renameFolder.useMutation({
      onSuccess: (data) => {
         setFolders((prevFolders) =>
            prevFolders.map((folder) =>
               folder.id === folderId ? { ...folder, folder_name: data.folder_name } : folder
            )
         );
         toast.success('Successfully changed folder name');
         onClose();
         setLoading(false);
      },
      onError: () => {
         toast.error('There was an error, please try again');
         setLoading(false);
      }
   });

   const onSubmit = (e: any) => {
      e.preventDefault();
      setLoading(true);
      const data = Object.fromEntries(new FormData(e.currentTarget)) as { folderName: string };
      changeMutation.mutate({ folderId, folder_name: data.folderName });
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
                              startContent={!loading && <IoCheckmark className="text-xl" />}
                              color="primary"
                              className="ml-auto"
                              isLoading={loading}
                              isDisabled={loading}
                           >
                              {loading ? 'Renaming...' : 'Rename'}
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
