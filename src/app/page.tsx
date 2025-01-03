'use client';

import BaseContainer from '@/components/BaseContainer';
import { Button } from '@nextui-org/react';
import { CldUploadButton } from 'next-cloudinary';

function Page() {
   const handleUploadSuccess = (result: CloudinaryEvent) => {
      console.log(result, result.info.secure_url);
   };

   // Cloudinary Download
   const handleDownload = async () => {
      // const secure_url = `${process.env.NEXT_PUBLIC_CLOUDINARY_URL}raw/upload/v1735886229/file-buddy/ctgumlcskc4m7d2zh6iq.zip`;
      const secure_url = `https://res.cloudinary.com/dwwdihklx/raw/upload/v1735886849/file-buddy/ztsffjoou7o7kiljkljj.pdf`;

      try {
         const response = await fetch(secure_url);

         if (!response.ok) {
            throw new Error(`Failed to download file: ${response.statusText}`);
         }

         const blob = await response.blob();
         const url = window.URL.createObjectURL(blob);
         const a = document.createElement('a');

         a.href = url;
         a.download = 'file.pdf'; // Filename from Database

         document.body.appendChild(a);

         a.click();
         a.remove();

         window.URL.revokeObjectURL(url);
      } catch (error) {
         console.error('Error downloading file:', error);
      }
   };

   const handleDelete = async () => {
      const requestOptions: RequestInit = {
         method: 'DELETE',
         body: JSON.stringify({ asset_ids: ['b61858ae0fe0bb83498fc4ee83fd52b9'] })
      };

      try {
         const response = await fetch('api/cloudinary', requestOptions);
         const data = await response.json();
         console.log(data);
      } catch (error) {
         console.error('Error downloading file:', error);
      }
   };

   return (
      <BaseContainer>
         <h1>Playground</h1>
         {/* Cloudinary Upload */}
         <CldUploadButton
            // options={{
            //    sources: ['local']
            // }}
            onSuccess={handleUploadSuccess as any}
            uploadPreset="file-buddy"
            className="rounded-md bg-primary p-3 text-white duration-250 ease-in hover:bg-primary-400"
         >
            Upload Files
         </CldUploadButton>
         <Button onPress={handleDownload}>Download</Button>
         <Button onPress={handleDelete}>Delete</Button>
      </BaseContainer>
   );
}

export default Page;
