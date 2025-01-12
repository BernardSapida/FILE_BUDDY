import { trpc } from '@/lib/trpc/client';
import { CldUploadButton } from 'next-cloudinary';
import { Dispatch, FunctionComponent, SetStateAction } from 'react';
import { FaPlus } from 'react-icons/fa';
import { toast } from 'sonner';

interface CloudinaryUploadButtonProps {
   folderId: string;
   setFiles: Dispatch<SetStateAction<File[]>>;
   setFileTypes: Dispatch<
      SetStateAction<
         {
            name: string;
            uid: string;
         }[]
      >
   >;
}

const CloudinaryUploadButton: FunctionComponent<CloudinaryUploadButtonProps> = ({
   folderId,
   setFiles,
   setFileTypes
}) => {
   const { data: folder_name, isLoading } = trpc.folder.getFolderName.useQuery({ folderId });
   const createMutation = trpc.file.createFile.useMutation({
      onSuccess: (file: any) => {
         setFiles((prevFiles) => [file as File, ...prevFiles]);
         setFileTypes((prevTypes) => {
            let foundType = false;

            for (let types of prevTypes) {
               if (types.name === file.type) foundType = true;
            }

            return [...prevTypes, { name: file.type, uid: file.type }];
         });
         toast.success('Successfully uploaded file');
      },
      onError: () => {
         toast.error('There was an error, please try again');
      }
   });

   const handleUploadSuccess = ({ info }: CloudinaryEvent) => {
      console.log(info);
      createMutation.mutate({
         folderId,
         file: {
            filename: info.public_id.split('/')[1],
            public_id: info.public_id,
            asset_id: info.asset_id,
            bytes: info.bytes,
            type: info.path.split('.')[1],
            secure_url: info.secure_url
         }
      });
   };

   return (
      <CldUploadButton
         options={{ sources: ['local'] }}
         onSuccess={handleUploadSuccess as any}
         uploadPreset="file-buddy"
         className="flex items-center gap-2 rounded-xl bg-primary p-2.5 text-sm text-white duration-250 ease-in hover:bg-primary-400"
      >
         <FaPlus className="text-sm" /> Upload Files
      </CldUploadButton>
   );
};

export default CloudinaryUploadButton;
