import { db } from '@/lib/db/index';
import { publicProcedure, router } from '@/lib/server/trpc';
import { z } from 'zod';

export const filesRouter = router({
   createFile: publicProcedure
      .input(
         z.object({
            folderId: z.string().min(1, { message: 'Folder ID is required' }),
            file: z.object({
               filename: z.string().min(1, { message: 'Filename is required' }),
               asset_id: z.string().min(1, { message: 'Assest ID is required' }),
               bytes: z.number(),
               type: z.string().min(1, { message: 'Type is required' }),
               secure_url: z.string().min(1, { message: 'Secure URL is required' })
            })
         })
      )
      .mutation(
         async ({
            input: {
               folderId,
               file: { filename, asset_id, bytes, type, secure_url }
            }
         }) => {
            const res = await db.file.create({
               data: {
                  filename,
                  asset_id,
                  bytes,
                  type,
                  secure_url,
                  folder: {
                     connect: {
                        id: folderId
                     }
                  }
               }
            });

            return res;
         }
      ),
   getFiles: publicProcedure
      .input(
         z.object({
            folderId: z.string().min(1, { message: 'Folder ID is required' })
         })
      )
      .query(async ({ input: { folderId } }) => {
         const res = await db.folder.findFirst({
            where: { id: folderId },
            select: { files: true }
         });

         return res;
      }),
   setFolderArchive: publicProcedure
      .input(
         z.object({
            fileId: z.string().min(1, { message: 'File ID is required' }),
            archived: z.boolean()
         })
      )
      .query(async ({ input: { fileId, archived } }) => {
         const res = await db.file.update({
            where: { id: fileId },
            data: { archived }
         });

         return res;
      }),
   setFileFavorite: publicProcedure
      .input(
         z.object({
            fileId: z.string().min(1, { message: 'File ID is required' }),
            favorited: z.boolean()
         })
      )
      .query(async ({ input: { fileId, favorited } }) => {
         const res = await db.file.update({
            where: { id: fileId },
            data: { favorited }
         });

         return res;
      }),
   setFileTrash: publicProcedure
      .input(
         z.object({
            fileIds: z.array(z.string()).min(1, { message: 'At least one file ID is required' }),
            trashed: z.boolean()
         })
      )
      .query(async ({ input: { fileIds, trashed } }) => {
         const res = await db.file.updateMany({
            where: { id: { in: fileIds } },
            data: { trashed }
         });

         return res;
      })
});
