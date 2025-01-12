import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
   // await createUser({
   //    clerkUserId: 'user_2r7mN0nAPeYV5ZI6uNgmd4hzbsk',
   //    firstname: 'Bernard',
   //    lastname: 'Sapida',
   //    email: 'bernardsapida1706@gmail.com'
   // });
   // await setFolderTrash(['6778097c4b3dcb722dd799fc', '6778a8ba96e3d0fc3a1e4abe'], true);
   // createFile('6778097c4b3dcb722dd799fc', {
   //    filename: 'Hello',
   //    asset_id: '123',
   //    bytes: 0,
   //    type: 'jpg',
   //    secure_url: 'http://localhost:3000'
   // });
   // getFiles('6778097c4b3dcb722dd799fc');
   // createFile('6778a8ba96e3d0fc3a1e4abe', {
   //    filename: 'File 1',
   //    asset_id: '123',
   //    bytes: 1000,
   //    type: 'jpg',
   //    secure_url: 'http://localhost:3000'
   // });
   const res = await prisma.file.findMany({
      where: {
         asset_id: { in: ['ba10b1e7868e3f52be45299af0ba5bd9', '03afdca1415d412bd97c18fb2bfc0a6a'] }
      },
      select: { public_id: true }
   });
   console.log(res?.map((file) => file.public_id));
}

const createUser = async ({
   clerkUserId,
   firstname,
   lastname,
   email
}: {
   clerkUserId: string;
   firstname: string;
   lastname: string;
   email: string;
}) => {
   const res = await prisma.user.create({
      data: {
         clerkUserId,
         firstname,
         lastname,
         email
      }
   });

   console.log(res);
};

// TODO Folder
const createFolder = async (clerkUserId: string, folder_name: string) => {
   const res = await prisma.folder.create({
      data: {
         folder_name,
         user: {
            connect: {
               clerkUserId: clerkUserId
            }
         }
      }
   });

   console.log(res);
};

const renameFolder = async (folderId: string, folder_name: string) => {
   const res = await prisma.folder.update({
      where: { id: folderId },
      data: { folder_name: folder_name }
   });

   console.log(res);
};

const setFolderFavorite = async (folderId: string, favorited: boolean) => {
   const res = await prisma.folder.update({
      where: { id: folderId },
      data: { favorited }
   });

   console.log(res);
};

const setFolderTrash = async (folderIds: string[], trashed: boolean) => {
   const res = await prisma.folder.updateMany({
      where: { id: { in: folderIds } },
      data: { trashed }
   });

   console.log(res);
};

const getFolders = async (clerkUserId: string) => {
   const res = await prisma.user.findFirst({
      where: { clerkUserId },
      select: { folders: { include: { files: { select: { bytes: true } } } } }
   });

   console.log(res);
};

const getFavoritedFolders = async (clerkUserId: string) => {
   const res = await prisma.folder.findMany({
      where: { user: { clerkUserId }, favorited: true }
   });

   console.log(res);
};

// TODO File
const createFile = async (
   folderId: string,
   {
      filename,
      asset_id,
      public_id,
      bytes,
      type,
      secure_url
   }: {
      filename: string;
      asset_id: string;
      public_id: string;
      bytes: number;
      type: string;
      secure_url: string;
   }
) => {
   const res = await prisma.file.create({
      data: {
         filename,
         asset_id,
         public_id,
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

   console.log(res);
};

const getFiles = async (folderId: string) => {
   const res = await prisma.folder.findFirst({
      where: { id: folderId },
      select: { files: true }
   });

   console.log(res);
};

const getFavoritedFiles = async (clerkUserId: string) => {
   const res = await prisma.file.findMany({
      where: { folder: { user: { clerkUserId } }, favorited: true }
   });

   console.log(res);
};

const getTrashedFiles = async (clerkUserId: string) => {
   const res = await prisma.file.findMany({
      where: { folder: { user: { clerkUserId } }, trashed: true }
   });

   console.log(res);
};

const getArchivedFiles = async (clerkUserId: string) => {
   const res = await prisma.file.findMany({
      where: { folder: { user: { clerkUserId } }, archived: true }
   });

   console.log(res);
};

const setFolderArchive = async (fileId: string, archived: boolean) => {
   const res = await prisma.file.update({
      where: { id: fileId },
      data: { archived }
   });

   console.log(res);
};

const setFileFavorite = async (fileId: string, favorited: boolean) => {
   const res = await prisma.file.update({
      where: { id: fileId },
      data: { favorited }
   });

   console.log(res);
};

const setFileTrash = async (fileIds: string[], trashed: boolean) => {
   const res = await prisma.file.updateMany({
      where: { id: { in: fileIds } },
      data: { trashed }
   });

   console.log(res);
};

main()
   .then(async () => {
      await prisma.$disconnect();
   })
   .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
   });
