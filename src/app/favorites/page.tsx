'use client';

import FoldersTable from '@/app/folders/components/FoldersTable';
import BaseContainer from '@/components/BaseContainer';
import { Tab, Tabs } from '@nextui-org/react';
import FilesTable from '../folder/[folderId]/components/FilesTable';

function Page() {
   const folders = [
      {
         id: '70d3bcf9-43f6-45b9-983f-a3e9d3815501',
         folder_name: 'bronze',
         bytes: 1000,
         favorited: true,
         trashed: false,
         createdAt: new Date('2025-01-02T13:22:24.004Z'),
         updatedAt: new Date('2025-01-02T13:22:24.004Z')
      },
      {
         id: '7ab96ffe-e592-4864-a336-f8d284ef021d',
         folder_name: 'champion',
         bytes: 2000,
         favorited: true,
         trashed: false,
         createdAt: new Date('2025-01-02T13:22:24.004Z'),
         updatedAt: new Date('2025-01-02T13:22:24.004Z')
      },
      {
         id: 'f2bdfd99-7867-4e10-b633-5d17fa518f8b',
         folder_name: 'crystal',
         bytes: 3000,
         favorited: true,
         trashed: false,
         createdAt: new Date('2025-01-02T13:22:24.004Z'),
         updatedAt: new Date('2025-01-02T13:22:24.004Z')
      }
   ] as Folder[];
   const files = [
      {
         id: '60434cc4-f2c9-4571-9107-4a33ec406de1',
         filename: 'master',
         asset_id: '60434cc4-f2c9-4571-9107-4a33ec406de1',
         bytes: 7000,
         type: 'jpg',
         secure_url:
            'https://res.cloudinary.com/dwwdihklx/image/upload/v1735898154/file-buddy/l8oq85tkpfnurtow8s3v.jpg',
         favorited: true,
         trashed: false,
         createdAt: new Date('2025-01-02T13:22:24.004Z'),
         updatedAt: new Date('2025-01-02T13:22:24.004Z')
      },
      {
         id: 'a8d8d59d-ede8-4c0c-9945-da824b8fa2f4',
         filename: 'silver',
         asset_id: 'a8d8d59d-ede8-4c0c-9945-da824b8fa2f4',
         bytes: 8000,
         type: 'jpg',
         secure_url:
            'https://res.cloudinary.com/dwwdihklx/image/upload/v1735898154/file-buddy/l8oq85tkpfnurtow8s3v.jpg',
         favorited: true,
         trashed: false,
         createdAt: new Date('2025-01-02T13:22:24.004Z'),
         updatedAt: new Date('2025-01-02T13:22:24.004Z')
      },
      {
         id: 'b526bf14-be71-497f-b394-b928631ab9aa',
         filename: 'titan',
         asset_id: 'b526bf14-be71-497f-b394-b928631ab9aa',
         bytes: 9000,
         type: 'jpg',
         secure_url:
            'https://res.cloudinary.com/dwwdihklx/image/upload/v1735898154/file-buddy/l8oq85tkpfnurtow8s3v.jpg',
         favorited: true,
         trashed: false,
         createdAt: new Date('2025-01-02T13:22:24.004Z'),
         updatedAt: new Date('2025-01-02T13:22:24.004Z')
      }
   ] as File[];

   return (
      <BaseContainer>
         <h1 className="mb-5 text-2xl font-semibold text-primary">Favorites</h1>
         <Tabs aria-label="Options">
            <Tab
               key="folders"
               title="Folders"
            >
               <FoldersTable
                  folders={folders}
                  showHeaderButtons={false}
                  isLoading={false}
               />
            </Tab>
            <Tab
               key="files"
               title="Files"
            >
               <FilesTable
                  files={files}
                  showHeaderButtons={false}
                  isLoading={false}
               />
            </Tab>
         </Tabs>
      </BaseContainer>
   );
}

export default Page;
