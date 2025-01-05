'use client';

import BaseContainer from '@/components/BaseContainer';
import FilesTable from '../folder/[folderId]/components/FilesTable';
import { trpc } from '@/lib/trpc/client';
import { useEffect, useState } from 'react';

function Page() {
   const [files, setFiles] = useState<File[]>([]);
   const { data: fileData, isLoading: fetchingFiles } = trpc.file.getArchivedFiles.useQuery();

   useEffect(() => {
      if (!fetchingFiles && fileData) setFiles(fileData as any);
   }, [fileData, fetchingFiles]);

   return (
      <BaseContainer>
         <h1 className="mb-5 text-2xl font-semibold text-primary">Archives</h1>
         <FilesTable
            files={files as any}
            setFiles={setFiles}
            isLoading={fetchingFiles}
         />
      </BaseContainer>
   );
}

export default Page;
