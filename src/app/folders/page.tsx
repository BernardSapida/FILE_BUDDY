'use client';

import BaseContainer from '@/components/BaseContainer';
import FoldersTable from '@/app/folders/components/FoldersTable';
import { trpc } from '@/lib/trpc/client';

function Page() {
   const { data, isLoading } = trpc.folder.getFolders.useQuery();

   return (
      <BaseContainer>
         <h1 className="mb-5 text-2xl font-semibold text-primary">Folder</h1>
         <FoldersTable
            folders={data?.folders as any}
            isLoading={isLoading}
         />
      </BaseContainer>
   );
}

export default Page;
