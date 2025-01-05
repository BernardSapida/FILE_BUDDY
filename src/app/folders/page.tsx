'use client';

import BaseContainer from '@/components/BaseContainer';
import FoldersTable from '@/app/folders/components/FoldersTable';
import { trpc } from '@/lib/trpc/client';
import { useEffect, useState } from 'react';

function Page() {
   const [folders, setFolders] = useState<Folder[]>([]);
   const { data: foldersData, isLoading: fetchingFolders } =
      trpc.folder.getFolders.useQuery(undefined);

   useEffect(() => {
      if (!fetchingFolders && foldersData) {
         foldersData.folders.map((folder: any) => {
            folder.bytes = folder.files.reduce((acc: number, file: File) => (acc += file.bytes), 0);
         });
         setFolders(foldersData.folders as any);
      }
   }, [foldersData, fetchingFolders]);

   return (
      <BaseContainer>
         <h1 className="mb-5 text-2xl font-semibold text-primary">Folder</h1>
         <FoldersTable
            folders={folders}
            setFolders={setFolders}
            isLoading={fetchingFolders}
         />
      </BaseContainer>
   );
}

export default Page;
