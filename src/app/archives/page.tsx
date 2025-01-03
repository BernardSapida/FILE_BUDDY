'use client';

import BaseContainer from '@/components/BaseContainer';
import { FunctionComponent } from 'react';
import FilesTable from '../folder/[folderId]/components/FilesTable';

interface PageProps {
   params: { folderId: string };
}

const Page: FunctionComponent<PageProps> = ({ params: { folderId } }) => {
   const files = [
      {
         id: '70d3bcf9-43f6-45b9-983f-a3e9d3815501',
         filename: 'bronze',
         asset_id: '70d3bcf9-43f6-45b9-983f-a3e9d3815501',
         bytes: 1000,
         type: 'jpg',
         secure_url:
            'https://res.cloudinary.com/dwwdihklx/image/upload/v1735898154/file-buddy/l8oq85tkpfnurtow8s3v.jpg',
         favorited: false,
         archived: true,
         trashed: false,
         createdAt: new Date('2025-01-02T13:22:24.004Z'),
         updatedAt: new Date('2025-01-02T13:22:24.004Z')
      },
      {
         id: '7ab96ffe-e592-4864-a336-f8d284ef021d',
         filename: 'champion',
         asset_id: '7ab96ffe-e592-4864-a336-f8d284ef021d',
         bytes: 2000,
         type: 'jpg',
         secure_url:
            'https://res.cloudinary.com/dwwdihklx/image/upload/v1735898154/file-buddy/l8oq85tkpfnurtow8s3v.jpg',
         favorited: false,
         archived: true,
         trashed: false,
         createdAt: new Date('2025-01-02T13:22:24.004Z'),
         updatedAt: new Date('2025-01-02T13:22:24.004Z')
      },
      {
         id: 'f2bdfd99-7867-4e10-b633-5d17fa518f8b',
         filename: 'crystal',
         asset_id: 'f2bdfd99-7867-4e10-b633-5d17fa518f8b',
         bytes: 3000,
         type: 'jpg',
         secure_url:
            'https://res.cloudinary.com/dwwdihklx/image/upload/v1735898154/file-buddy/l8oq85tkpfnurtow8s3v.jpg',
         favorited: false,
         archived: true,
         trashed: false,
         createdAt: new Date('2025-01-02T13:22:24.004Z'),
         updatedAt: new Date('2025-01-02T13:22:24.004Z')
      },
      {
         id: 'e8313b94-aa1f-4524-99c2-71f1dfa5c569',
         filename: 'gold',
         asset_id: 'e8313b94-aa1f-4524-99c2-71f1dfa5c569',
         bytes: 4000,
         type: 'jpg',
         secure_url:
            'https://res.cloudinary.com/dwwdihklx/image/upload/v1735898154/file-buddy/l8oq85tkpfnurtow8s3v.jpg',
         favorited: false,
         archived: true,
         trashed: false,
         createdAt: new Date('2025-01-02T13:22:24.004Z'),
         updatedAt: new Date('2025-01-02T13:22:24.004Z')
      },
      {
         id: 'c8015f45-d79f-4200-a824-d2f25f654233',
         filename: 'goldpass',
         asset_id: 'c8015f45-d79f-4200-a824-d2f25f654233',
         bytes: 5000,
         type: 'jpg',
         secure_url:
            'https://res.cloudinary.com/dwwdihklx/image/upload/v1735898154/file-buddy/l8oq85tkpfnurtow8s3v.jpg',
         favorited: false,
         archived: true,
         trashed: false,
         createdAt: new Date('2025-01-02T13:22:24.004Z'),
         updatedAt: new Date('2025-01-02T13:22:24.004Z')
      },
      {
         id: 'b38bdab6-f7e2-48d7-8975-ce9ff2fcc51a',
         filename: 'legend',
         asset_id: 'b38bdab6-f7e2-48d7-8975-ce9ff2fcc51a',
         bytes: 6000,
         type: 'jpg',
         secure_url:
            'https://res.cloudinary.com/dwwdihklx/image/upload/v1735898154/file-buddy/l8oq85tkpfnurtow8s3v.jpg',
         favorited: false,
         archived: true,
         trashed: false,
         createdAt: new Date('2025-01-02T13:22:24.004Z'),
         updatedAt: new Date('2025-01-02T13:22:24.004Z')
      },
      {
         id: '60434cc4-f2c9-4571-9107-4a33ec406de1',
         filename: 'master',
         asset_id: '60434cc4-f2c9-4571-9107-4a33ec406de1',
         bytes: 7000,
         type: 'jpg',
         secure_url:
            'https://res.cloudinary.com/dwwdihklx/image/upload/v1735898154/file-buddy/l8oq85tkpfnurtow8s3v.jpg',
         favorited: false,
         archived: true,
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
         favorited: false,
         archived: true,
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
         favorited: false,
         archived: true,
         trashed: false,
         createdAt: new Date('2025-01-02T13:22:24.004Z'),
         updatedAt: new Date('2025-01-02T13:22:24.004Z')
      }
   ] as File[];

   return (
      <BaseContainer>
         <h1 className="mb-5 text-2xl font-semibold text-primary">Archives</h1>
         <FilesTable
            files={files}
            isLoading={false}
         />
      </BaseContainer>
   );
};

export default Page;
