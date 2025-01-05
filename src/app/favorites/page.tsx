'use client';

import FoldersTable from '@/app/folders/components/FoldersTable';
import BaseContainer from '@/components/BaseContainer';
import { Tab, Tabs } from '@nextui-org/react';
import FilesTable from '../folder/[folderId]/components/FilesTable';
import { trpc } from '@/lib/trpc/client';
import { useEffect, useState } from 'react';

function Page() {
   const [folders, setFolders] = useState<Folder[]>([]);
   const [files, setFiles] = useState<File[]>([]);
   const { data: foldersData, isLoading: fetchingFolders } =
      trpc.folder.getFavoritedFolders.useQuery();
   const { data: filesData, isLoading: fetchingFiles } = trpc.file.getFavoritedFiles.useQuery();

   useEffect(() => {
      if (!fetchingFolders && foldersData) setFolders(foldersData as any);
   }, [foldersData, fetchingFolders]);

   useEffect(() => {
      if (!fetchingFiles && filesData) setFiles(filesData as any);
   }, [filesData, fetchingFiles]);

   return (
      <BaseContainer>
         <h1 className="mb-5 text-2xl font-semibold text-primary">Favorites</h1>
         <Tabs aria-label="Options">
            <Tab
               key="folders"
               title="Folders"
            >
               <FoldersTable
                  folders={folders as any}
                  setFolders={setFolders}
                  isLoading={fetchingFolders}
               />
            </Tab>
            <Tab
               key="files"
               title="Files"
            >
               <FilesTable
                  files={files as any}
                  setFiles={setFiles}
                  isLoading={fetchingFiles}
               />
            </Tab>
         </Tabs>
      </BaseContainer>
   );
}

export default Page;
