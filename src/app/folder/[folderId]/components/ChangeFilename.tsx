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

interface ChangeFilenameModalProps {
   fileId: string;
   filename: string;
   setFiles: Dispatch<SetStateAction<File[]>>;
}

const ChangeFilenameModal: FunctionComponent<ChangeFilenameModalProps> = ({
   fileId,
   filename,
   setFiles
}) => {
   const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

   const onSubmit = (e: any) => {
      e.preventDefault();

      const data = Object.fromEntries(new FormData(e.currentTarget)) as { filename: string };

      toast.promise(new Promise((resolve) => setTimeout(() => resolve({}), 1000)), {
         loading: 'Changing filename...',
         success: () => {
            setFiles((prevFiles) =>
               prevFiles.map((file) =>
                  file.id === fileId ? { ...file, filename: data.filename } : file
               )
            );
            return `Successfully changed filename!`;
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
                     <ModalHeader className="flex flex-col gap-1">Rename File</ModalHeader>
                     <Divider />
                     <ModalBody className="py-5">
                        <Form
                           validationBehavior="native"
                           onSubmit={onSubmit}
                           className="space-y-2"
                        >
                           <Input
                              type="text"
                              name="filename"
                              defaultValue={filename}
                              placeholder="Filename"
                              aria-label="Filename input"
                              validate={(value) => {
                                 if (!value) return 'Filename is required';
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

export default ChangeFilenameModal;
