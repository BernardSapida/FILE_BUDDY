'use client';

import BaseContainer from '@/components/BaseContainer';
import { trpc } from '@/lib/trpc/client';
import { FunctionComponent, useEffect, useState } from 'react';
import DateRange from './components/DateRange';
import FilesTable from './components/FilesTable';

interface PageProps {
   params: { folderId: string };
}

const Page: FunctionComponent<PageProps> = ({ params: { folderId } }) => {
   const [files, setFiles] = useState<File[]>([]);
   const [dates, setDates] = useState<{ startDate?: Date; endDate?: Date }>({
      startDate: undefined,
      endDate: undefined
   });
   const { data: filesData, isLoading: fetchingFiles } = trpc.file.getAllFiles.useQuery({
      startDate: dates.startDate,
      endDate: dates.endDate
   });

   useEffect(() => {
      if (!fetchingFiles && filesData) setFiles(filesData as any);
   }, [filesData, fetchingFiles]);

   return (
      <BaseContainer>
         <h1 className="mb-5 text-2xl font-semibold text-primary">All Files</h1>
         <DateRange setDates={setDates} />
         <FilesTable
            files={files}
            setFiles={setFiles}
            folderId={folderId}
            isLoading={fetchingFiles}
         />
      </BaseContainer>
   );
};

export default Page;
