'use client';

import BaseContainer from '@/components/BaseContainer';
import FilesTable from '../folder/[folderId]/components/FilesTable';
import { trpc } from '@/lib/trpc/client';

function Page() {
   const { data: files, isLoading: fetchingFiles } = trpc.file.getArchivedFiles.useQuery();

   return (
      <BaseContainer>
         <h1 className="mb-5 text-2xl font-semibold text-primary">Archives</h1>
         <FilesTable
            files={files as any}
            isLoading={fetchingFiles}
         />
      </BaseContainer>
   );
}

export default Page;
