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
   Select,
   SelectItem,
   useDisclosure
} from '@nextui-org/react';
import { Dispatch, FunctionComponent, SetStateAction, useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { IoCheckmark } from 'react-icons/io5';
import { toast } from 'sonner';

interface FileTagProps {
   fileId: string;
   tag: string;
   tagColor: string;
   setFiles: Dispatch<SetStateAction<File[]>>;
}

const FileTag: FunctionComponent<FileTagProps> = ({ fileId, tag, tagColor, setFiles }) => {
   const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
   const [loading, setLoading] = useState<boolean>(false);

   const changeMutation = trpc.file.renameTag.useMutation({
      onSuccess: (data) => {
         setFiles((prevFiles) =>
            prevFiles.map((file) =>
               file.id === fileId
                  ? { ...file, tag: data.tag, tag_color: data.tag_color, updatedAt: new Date() }
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

      const data = Object.fromEntries(new FormData(e.currentTarget)) as {
         tag: string;
         tagColor: string;
      };
      changeMutation.mutate({ fileId, tag: data.tag, tagColor: data.tagColor });
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
                     <ModalHeader className="flex flex-col gap-1">Rename Tag</ModalHeader>
                     <Divider />
                     <ModalBody className="py-5">
                        <Form
                           validationBehavior="native"
                           onSubmit={onSubmit}
                           className="space-y-2"
                        >
                           <Input
                              type="text"
                              name="tag"
                              defaultValue={tag}
                              placeholder="Tag"
                              label="Tag"
                              aria-label="Tag input"
                              validate={(value) => {
                                 if (!value) return 'Tag is required';
                              }}
                              isRequired
                           />
                           <Select
                              name="tagColor"
                              label="Tag Color"
                           >
                              <SelectItem key="default">Gray</SelectItem>
                              <SelectItem key="primary">Blue</SelectItem>
                              <SelectItem key="success">Green</SelectItem>
                              <SelectItem key="secondary">Purple</SelectItem>
                              <SelectItem key="danger">Red</SelectItem>
                           </Select>
                           <Button
                              type="submit"
                              size="sm"
                              startContent={!loading && <IoCheckmark className="text-xl" />}
                              color="primary"
                              className="ml-auto"
                              isLoading={loading}
                              isDisabled={loading}
                           >
                              {loading ? 'Renaming tag...' : 'Rename'}
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

export default FileTag;
