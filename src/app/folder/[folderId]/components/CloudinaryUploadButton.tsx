import { trpc } from '@/lib/trpc/client';
import { CldUploadButton } from 'next-cloudinary';
import { Dispatch, FunctionComponent, SetStateAction } from 'react';
import { FaPlus } from 'react-icons/fa';
import { toast } from 'sonner';

interface CloudinaryUploadButtonProps {
   folderId: string;
   setFiles: Dispatch<SetStateAction<File[]>>;
}

const CloudinaryUploadButton: FunctionComponent<CloudinaryUploadButtonProps> = ({
   folderId,
   setFiles
}) => {
   const createMutation = trpc.file.createFile.useMutation({
      onSuccess: (file) => {
         setFiles((prevFiles) => [file as File, ...prevFiles]);
         toast.success('Successfully uploaded file');
      },
      onError: () => {
         toast.error('There was an error, please try again');
      }
   });

   const handleUploadSuccess = ({ info }: CloudinaryEvent) => {
      createMutation.mutate({
         folderId,
         file: {
            filename: info.original_filename,
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
