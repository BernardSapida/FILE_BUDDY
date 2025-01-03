import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
   // await createUser({
   //    clerkUserId: 'user_2r7mN0nAPeYV5ZI6uNgmd4hzbsk',
   //    firstname: 'Bernard',
   //    lastname: 'Sapida',
   //    email: 'bernardsapida1706@gmail.com'
   // });

   await getFolders('user_2r7mN0nAPeYV5ZI6uNgmd4hzbsk');
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

// TODO L1 /folders
const createFolder = async (clerkUserId: string, { folder_name }: { folder_name: string }) => {
   const res = await prisma.folder.create({
      data: {
         folder_name: folder_name,
         user: {
            connect: {
               clerkUserId: clerkUserId
            }
         }
      }
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

main()
   .then(async () => {
      await prisma.$disconnect();
   })
   .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
   });
