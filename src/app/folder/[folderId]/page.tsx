'use client';

import BaseContainer from '@/components/BaseContainer';
import { FunctionComponent } from 'react';
import FilesTable from './components/FilesTable';
import { trpc } from '@/lib/trpc/client';

interface PageProps {
   params: { folderId: string };
}

const Page: FunctionComponent<PageProps> = ({ params: { folderId } }) => {
   const { data: fileData, isLoading } = trpc.file.getFiles.useQuery({ folderId });

   return (
      <BaseContainer>
         <h1 className="mb-5 text-2xl font-semibold text-primary">
            {fileData?.folder_name}&apos;s Files
         </h1>
         <FilesTable
            files={fileData?.files as any}
            folderId={folderId}
            isLoading={isLoading}
         />
      </BaseContainer>
   );
};

export default Page;
