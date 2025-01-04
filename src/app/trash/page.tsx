'use client';

import FoldersTable from '@/app/folders/components/FoldersTable';
import BaseContainer from '@/components/BaseContainer';
import { Tab, Tabs } from '@nextui-org/react';
import FilesTable from '../folder/[folderId]/components/FilesTable';
import { trpc } from '@/lib/trpc/client';

function Page() {
   const { data: folders, isLoading: fetchingFolders } = trpc.folder.getTrashedFolders.useQuery();
   const { data: files, isLoading: fetchingFiles } = trpc.file.getTrashedFiles.useQuery();

   return (
      <BaseContainer>
         <h1 className="mb-5 text-2xl font-semibold text-primary">Trash</h1>
         <Tabs aria-label="Options">
            <Tab
               key="folders"
               title="Folders"
            >
               <FoldersTable
                  folders={folders as any}
                  isLoading={fetchingFolders}
               />
            </Tab>
            <Tab
               key="files"
               title="Files"
            >
               <FilesTable
                  files={files as any}
                  isLoading={fetchingFiles}
               />
            </Tab>
         </Tabs>
      </BaseContainer>
   );
}

export default Page;
