'use client';

import FoldersTable from '@/app/folders/components/FoldersTable';
import BaseContainer from '@/components/BaseContainer';
import { Tab, Tabs } from '@nextui-org/react';
import FilesTable from '../folder/[folderId]/components/FilesTable';
import { trpc } from '@/lib/trpc/client';
import { useState, useEffect } from 'react';

function Page() {
   const [folders, setFolders] = useState<Folder[]>([]);
   const [files, setFiles] = useState<File[]>([]);
   const [fileTypes, setFileTypes] = useState<{ name: string; uid: string }[]>([]);
   const { data: foldersData, isLoading: fetchingFolders } =
      trpc.folder.getTrashedFolders.useQuery();
   const {
      data: filesData,
      isLoading: fetchingFiles,
      refetch: refetchFiles
   } = trpc.file.getTrashedFiles.useQuery();
   const { data: fileTypesData, isLoading: fetchingTypes } =
      trpc.file.getFolderFileTypes.useQuery();

   useEffect(() => {
      if (!fetchingFolders && foldersData) {
         foldersData.map((folder: any) => {
            folder.bytes = folder.files.reduce((acc: number, file: File) => (acc += file.bytes), 0);
         });
         setFolders(foldersData as any);
      }
   }, [foldersData, fetchingFolders]);

   useEffect(() => {
      if (!fetchingFiles && files) setFiles(filesData as any);
   }, [filesData, fetchingFiles]);

   useEffect(() => {
      refetchFiles();
   }, [folders]);

   useEffect(() => {
      if (!fetchingTypes && fileTypesData) {
         setFileTypes(fileTypesData);
      }
   }, [fileTypesData, fetchingTypes]);

   return (
      <BaseContainer>
         <h1 className="mb-5 text-2xl font-semibold text-primary">Trash</h1>
         <Tabs aria-label="Options">
            <Tab
               key="folders"
               title="Folders"
            >
               <FoldersTable
                  folders={folders}
                  setFolders={setFolders}
                  isLoading={fetchingFolders}
               />
            </Tab>
            <Tab
               key="files"
               title="Files"
            >
               <FilesTable
                  files={files}
                  setFiles={setFiles}
                  isLoading={fetchingFiles}
                  typeOptions={fileTypes || fetchingTypes}
                  setFileTypes={setFileTypes}
               />
            </Tab>
         </Tabs>
      </BaseContainer>
   );
}

export default Page;
