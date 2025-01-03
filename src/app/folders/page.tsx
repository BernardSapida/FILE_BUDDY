'use client';

import BaseContainer from '@/components/BaseContainer';
import FoldersTable from '@/app/folders/components/FoldersTable';

function Page() {
   const folders = [
      {
         id: '70d3bcf9-43f6-45b9-983f-a3e9d3815501',
         folder_name: 'bronze',
         bytes: 1000,
         favorited: false,
         trashed: false,
         createdAt: new Date('2025-01-02T13:22:24.004Z'),
         updatedAt: new Date('2025-01-02T13:22:24.004Z')
      },
      {
         id: '7ab96ffe-e592-4864-a336-f8d284ef021d',
         folder_name: 'champion',
         bytes: 2000,
         favorited: false,
         trashed: false,
         createdAt: new Date('2025-01-02T13:22:24.004Z'),
         updatedAt: new Date('2025-01-02T13:22:24.004Z')
      },
      {
         id: 'f2bdfd99-7867-4e10-b633-5d17fa518f8b',
         folder_name: 'crystal',
         bytes: 3000,
         favorited: false,
         trashed: false,
         createdAt: new Date('2025-01-02T13:22:24.004Z'),
         updatedAt: new Date('2025-01-02T13:22:24.004Z')
      },
      {
         id: 'e8313b94-aa1f-4524-99c2-71f1dfa5c569',
         folder_name: 'gold',
         bytes: 4000,
         favorited: false,
         trashed: false,
         createdAt: new Date('2025-01-02T13:22:24.004Z'),
         updatedAt: new Date('2025-01-02T13:22:24.004Z')
      },
      {
         id: 'c8015f45-d79f-4200-a824-d2f25f654233',
         folder_name: 'goldpass',
         bytes: 5000,
         favorited: false,
         trashed: false,
         createdAt: new Date('2025-01-02T13:22:24.004Z'),
         updatedAt: new Date('2025-01-02T13:22:24.004Z')
      },
      {
         id: 'b38bdab6-f7e2-48d7-8975-ce9ff2fcc51a',
         folder_name: 'legend',
         bytes: 6000,
         favorited: false,
         trashed: false,
         createdAt: new Date('2025-01-02T13:22:24.004Z'),
         updatedAt: new Date('2025-01-02T13:22:24.004Z')
      },
      {
         id: '60434cc4-f2c9-4571-9107-4a33ec406de1',
         folder_name: 'master',
         bytes: 7000,
         favorited: false,
         trashed: false,
         createdAt: new Date('2025-01-02T13:22:24.004Z'),
         updatedAt: new Date('2025-01-02T13:22:24.004Z')
      },
      {
         id: 'a8d8d59d-ede8-4c0c-9945-da824b8fa2f4',
         folder_name: 'silver',
         bytes: 8000,
         favorited: false,
         trashed: false,
         createdAt: new Date('2025-01-02T13:22:24.004Z'),
         updatedAt: new Date('2025-01-02T13:22:24.004Z')
      },
      {
         id: 'b526bf14-be71-497f-b394-b928631ab9aa',
         folder_name: 'titan',
         bytes: 9000,
         favorited: false,
         trashed: false,
         createdAt: new Date('2025-01-02T13:22:24.004Z'),
         updatedAt: new Date('2025-01-02T13:22:24.004Z')
      }
   ] as Folder[];

   return (
      <BaseContainer>
         <h1 className="mb-5 text-2xl font-semibold text-primary">Folder</h1>
         <FoldersTable
            folders={folders}
            isLoading={false}
         />
      </BaseContainer>
   );
}

export default Page;
