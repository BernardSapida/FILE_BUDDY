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

interface ChangeFilenameProps {
   fileId: string;
   filename: string;
   setFiles: Dispatch<SetStateAction<File[]>>;
}

const ChangeFilename: FunctionComponent<ChangeFilenameProps> = ({ fileId, filename, setFiles }) => {
   const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
   const [loading, setLoading] = useState<boolean>(false);

   const changeMutation = trpc.file.renameFile.useMutation({
      onSuccess: (data) => {
         setFiles((prevFiles) =>
            prevFiles.map((file) =>
               file.id === fileId
                  ? { ...file, filename: data.filename, updatedAt: new Date() }
                  : file
            )
         );
         toast.success('Successfully changed filename');
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

      const data = Object.fromEntries(new FormData(e.currentTarget)) as { filename: string };
      changeMutation.mutate({ fileId, filename: data.filename });
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

export default ChangeFilename;
