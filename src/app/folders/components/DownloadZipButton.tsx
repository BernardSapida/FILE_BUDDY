import { trpc } from '@/lib/trpc/client';
import { Button } from '@nextui-org/react';
import { FunctionComponent } from 'react';
import { BsDownload } from 'react-icons/bs';
import { toast } from 'sonner';

interface DownloadZipButtonProps {
   folderIds: string[];
}

const DownloadZipButton: FunctionComponent<DownloadZipButtonProps> = ({ folderIds }) => {
   const { data: publicIds, isLoading: isFetchingPublicIds } =
      trpc.folder.getFilesPublicId.useQuery({ folderIds });

   const handleDownload = async () => {
      toast.promise(sendZipRequest, {
         loading: 'Downloading as zip...',
         success({ data }) {
            downloadZip(data.public_id, data.secure_url, data.asset_id);
            return `Successfully downloaded as ZIP`;
         },
         error: 'There was an error downloading, please try again'
      });
   };

   const sendZipRequest = async () => {
      const requestOptions: RequestInit = {
         method: 'POST',
         body: JSON.stringify({ public_ids: publicIds })
      };

      try {
         const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/cloudinary`,
            requestOptions
         );
         const data = await response.json();
         return data;
      } catch (error: any) {
         throw new Error(error);
      }
   };

   const deleteFilesInCloudinary = async (asset_ids: string[]) => {
      const requestOptions: RequestInit = {
         method: 'DELETE',
         body: JSON.stringify({ asset_ids: asset_ids })
      };

      try {
         const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/cloudinary`,
            requestOptions
         );
         const data = await response.json();
         console.log(data);
      } catch (error) {
         console.error('Error downloading file:', error);
      }
   };

   const downloadZip = async (filename: string, secure_url: string, asset_id: string) => {
      const a = document.createElement('a');

      a.href = secure_url;
      a.download = filename;

      document.body.appendChild(a);

      a.click();
      a.remove();

      setTimeout(() => deleteFilesInCloudinary([asset_id]), 10000);
   };

   return (
      <Button
         type="submit"
         startContent={<BsDownload />}
         color="secondary"
         className="ml-auto"
         onPress={handleDownload}
         isDisabled={isFetchingPublicIds}
      >
         Download as ZIP
      </Button>
   );
};

export default DownloadZipButton;
