import { CldUploadButton } from 'next-cloudinary';
import { Dispatch, FunctionComponent, SetStateAction } from 'react';
import { FaPlus } from 'react-icons/fa';

interface CloudinaryUploadButtonProps {
   setFiles: Dispatch<SetStateAction<File[]>>;
}

const CloudinaryUploadButton: FunctionComponent<CloudinaryUploadButtonProps> = ({ setFiles }) => {
   const handleUploadSuccess = ({ info }: CloudinaryEvent) => {
      setFiles((prevFIles) => [
         {
            id: new Date().toString(),
            filename: info.original_filename,
            asset_id: info.asset_id,
            bytes: info.bytes,
            type: info.path.split('.')[1],
            secure_url: info.secure_url,
            favorited: false,
            trashed: false,
            createdAt: new Date(),
            updatedAt: new Date()
         } as any,
         ...prevFIles
      ]);
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
