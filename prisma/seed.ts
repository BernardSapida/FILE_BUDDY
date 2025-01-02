import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
   await prisma.builder.deleteMany();
   await prisma.timer.deleteMany();
   await prisma.timeDuration.deleteMany();
}

main()
   .then(async () => {
      await prisma.$disconnect();
   })
   .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
   });
