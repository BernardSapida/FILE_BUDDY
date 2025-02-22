'use client';

import BaseContainer from '@/components/BaseContainer';
import { FunctionComponent, useEffect, useState } from 'react';
import FilesTable from './components/FilesTable';
import { trpc } from '@/lib/trpc/client';

interface PageProps {
   params: { folderId: string };
}

const Page: FunctionComponent<PageProps> = ({ params: { folderId } }) => {
   const [files, setFiles] = useState<File[]>([]);
   const [fileTypes, setFileTypes] = useState<{ name: string; uid: string }[]>([]);
   const { data: fileTypesData, isLoading: fetchingTypes } =
      trpc.file.getFolderFileTypes.useQuery();
   const { data: fileData, isLoading: fetchingFiles } = trpc.file.getFiles.useQuery({ folderId });

   useEffect(() => {
      if (!fetchingFiles && fileData) {
         fileData.files = fileData?.files.map((file) => ({
            ...file,
            folder: { folder_name: fileData?.folder_name }
         }));

         setFiles(fileData.files as any);
      }
   }, [fileData, fetchingFiles]);

   useEffect(() => {
      if (!fetchingTypes && fileTypesData) {
         setFileTypes(fileTypesData);
      }
   }, [fileTypesData, fetchingTypes]);

   return (
      <BaseContainer>
         <h1 className="mb-5 text-2xl font-semibold text-primary">
            {fileData?.folder_name}&apos;s Files
         </h1>
         <FilesTable
            files={files}
            setFiles={setFiles}
            folderId={folderId}
            isLoading={fetchingFiles || fetchingTypes}
            typeOptions={fileTypes}
            setFileTypes={setFileTypes}
         />
      </BaseContainer>
   );
};

export default Page;
