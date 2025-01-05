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
   renameFile: publicProcedure
      .input(
         z.object({
            fileId: z.string().min(1, { message: 'File id is required' }),
            filename: z.string().min(1, { message: 'Filename is required' })
         })
      )
      .mutation(async ({ input: { fileId, filename } }) => {
         const res = await db.file.update({
            where: { id: fileId },
            data: { filename }
         });

         return res;
      }),
   renameTag: publicProcedure
      .input(
         z.object({
            fileId: z.string().min(1, { message: 'File id is required' }),
            tag: z.string().min(1, { message: 'Tag is required' }),
            tagColor: z.string().min(1, { message: 'Tag color is required' })
         })
      )
      .mutation(async ({ input: { fileId, tag, tagColor } }) => {
         const res = await db.file.update({
            where: { id: fileId },
            data: { tag, tag_color: tagColor as any }
         });

         return res;
      }),
   getAllFiles: publicProcedure
      .input(
         z.object({
            startDate: z.date({ message: 'Start date is required' }).optional(),
            endDate: z.date({ message: 'End date is required' }).optional()
         })
      )
      .query(async ({ input: { startDate, endDate }, ctx }) => {
         const clerkUserId = ctx.session?.user.id;
         const dateFilter =
            startDate && endDate
               ? { createdAt: { gte: startDate, lte: endDate } }
               : startDate
                 ? { createdAt: { gte: startDate } }
                 : endDate
                   ? { createdAt: { lte: endDate } }
                   : {};
         const filter = {
            folder: { user: { clerkUserId } },
            AND: { archived: false, trashed: false },
            ...dateFilter
         };

         const res = await db.file.findMany({
            where: filter,
            include: { folder: { select: { folder_name: true } } }
         });

         return res;
      }),
   getFiles: publicProcedure
      .input(
         z.object({
            folderId: z.string().min(1, { message: 'Folder ID is required' })
         })
      )
      .query(async ({ input: { folderId } }) => {
         const res = await db.folder.findFirst({
            where: { id: folderId },
            select: {
               folder_name: true,
               files: {
                  where: { AND: { archived: false, trashed: false } }
               }
            }
         });

         return res;
      }),
   getFavoritedFiles: publicProcedure.query(async ({ ctx }) => {
      const clerkUserId = ctx.session?.user.id;
      const res = await db.file.findMany({
         where: {
            folder: { user: { clerkUserId } },
            favorited: true,
            AND: { archived: false, trashed: false }
         }
      });

      return res;
   }),
   getTrashedFiles: publicProcedure.query(async ({ ctx }) => {
      const clerkUserId = ctx.session?.user.id;
      const res = await db.file.findMany({
         where: { folder: { user: { clerkUserId } }, trashed: true }
      });

      return res;
   }),
   getArchivedFiles: publicProcedure.query(async ({ ctx }) => {
      const clerkUserId = ctx.session?.user.id;
      const res = await db.file.findMany({
         where: { folder: { user: { clerkUserId } }, archived: true }
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
      .mutation(async ({ input: { fileId, archived } }) => {
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
      .mutation(async ({ input: { fileId, favorited } }) => {
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
      .mutation(async ({ input: { fileIds, trashed } }) => {
         const res = await db.file.updateMany({
            where: { asset_id: { in: fileIds } },
            data: { trashed }
         });

         return res;
      }),
   deleteFiles: publicProcedure
      .input(
         z.object({
            fileIds: z.array(z.string()).min(1, { message: 'At least one folder ID is required' })
         })
      )
      .mutation(async ({ input: { fileIds } }) => {
         const res = await db.file.deleteMany({
            where: { asset_id: { in: fileIds } }
         });

         return res;
      })
});
