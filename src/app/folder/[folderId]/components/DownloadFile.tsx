import { Button, Tooltip } from '@nextui-org/react';
import { FunctionComponent } from 'react';
import { IoDownloadOutline } from 'react-icons/io5';
import { toast } from 'sonner';

interface DownloadFileProps {
   filename: string;
   type: string;
   secureUrl: string;
}

const DownloadFile: FunctionComponent<DownloadFileProps> = ({ filename, type, secureUrl }) => {
   const handleDownload = async () => {
      toast.promise(downloadFile, {
         loading: 'Downloading...',
         success: () => {
            return `Successfully downloaded`;
         },
         error: 'There was an error downloading, please try again'
      });
   };

   const downloadFile = async () => {
      try {
         const response = await fetch(secureUrl);

         if (!response.ok) {
            throw new Error(`Failed to download file: ${response.statusText}`);
         }

         const blob = await response.blob();
         const url = window.URL.createObjectURL(blob);
         const a = document.createElement('a');

         a.href = url;
         a.download = `${filename}.${type}`; // Filename from Database

         document.body.appendChild(a);

         a.click();
         a.remove();

         window.URL.revokeObjectURL(url);
      } catch (error) {
         console.error('Error downloading file:', error);
      }
   };

   return (
      <Tooltip content="Download">
         <Button
            isIconOnly
            size="sm"
            variant="light"
            className="text-base text-default-400"
            onPress={handleDownload}
            startContent={<IoDownloadOutline className="text-xl" />}
         />
      </Tooltip>
   );
};

export default DownloadFile;
