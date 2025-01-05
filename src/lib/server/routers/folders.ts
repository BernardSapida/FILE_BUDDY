import { db } from '@/lib/db/index';
import { publicProcedure, router } from '@/lib/server/trpc';
import { z } from 'zod';

export const foldersRouter = router({
   createFolder: publicProcedure
      .input(
         z.object({
            folder_name: z.string().min(1, { message: 'Folder name is required' })
         })
      )
      .mutation(async ({ input: { folder_name }, ctx }) => {
         const clerkUserId = ctx.session?.user.id;
         const res = await db.folder.create({
            data: {
               folder_name,
               user: {
                  connect: { clerkUserId: clerkUserId }
               }
            }
         });

         return res;
      }),
   renameFolder: publicProcedure
      .input(
         z.object({
            folderId: z.string().min(1, { message: 'Folder id is required' }),
            folder_name: z.string().min(1, { message: 'Folder name is required' })
         })
      )
      .mutation(async ({ input: { folderId, folder_name } }) => {
         const res = await db.folder.update({
            where: { id: folderId },
            data: { folder_name: folder_name }
         });

         return res;
      }),
   setFolderFavorite: publicProcedure
      .input(
         z.object({
            folderId: z.string().min(1, { message: 'Folder id is required' }),
            favorited: z.boolean()
         })
      )
      .mutation(async ({ input: { folderId, favorited } }) => {
         const res = await db.folder.update({
            where: { id: folderId },
            data: { favorited }
         });

         return res;
      }),
   setFolderTrash: publicProcedure
      .input(
         z.object({
            folderIds: z
               .array(z.string())
               .min(1, { message: 'At least one folder ID is required' }),
            trashed: z.boolean()
         })
      )
      .mutation(async ({ input: { folderIds, trashed } }) => {
         const res = await db.folder.updateMany({
            where: { id: { in: folderIds } },
            data: { trashed }
         });

         return res;
      }),
   getFolders: publicProcedure.query(async ({ ctx }) => {
      const clerkUserId = ctx.session?.user.id;
      const res = await db.user.findFirst({
         where: { clerkUserId },
         select: {
            folders: {
               where: { trashed: false },
               include: { files: { select: { bytes: true } } }
            }
         }
      });

      return res;
   }),
   getTrashedFolders: publicProcedure.query(async ({ ctx }) => {
      const clerkUserId = ctx.session?.user.id;
      const res = await db.folder.findMany({
         where: { user: { clerkUserId }, trashed: true },
         include: { files: { select: { bytes: true } } }
      });

      return res;
   }),
   getFavoritedFolders: publicProcedure.query(async ({ ctx }) => {
      const clerkUserId = ctx.session?.user.id;
      const res = await db.folder.findMany({
         where: { user: { clerkUserId }, favorited: true },
         include: { files: { select: { bytes: true } } }
      });

      return res;
   }),
   deleteFolders: publicProcedure
      .input(
         z.object({
            folderIds: z.array(z.string()).min(1, { message: 'At least one folder ID is required' })
         })
      )
      .mutation(async ({ input: { folderIds } }) => {
         const res = await db.$transaction([
            db.file.deleteMany({
               where: { folder: { id: { in: folderIds } } }
            }),
            db.folder.deleteMany({
               where: { id: { in: folderIds } }
            })
         ]);

         return res;
      })
});
