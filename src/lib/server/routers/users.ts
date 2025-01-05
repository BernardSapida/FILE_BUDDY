import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db/index';
import { publicProcedure, router } from '@/lib/server/trpc';

export const usersRouter = router({
   handleAuth: publicProcedure.mutation(async ({ ctx }) => {
      const clerkUserId = ctx.session?.user.id;

      if (!clerkUserId) {
         throw new Error('User session not found!');
      }

      // Fetch user by clerkId
      const user = await db.user.findFirst({
         where: { clerkUserId }
      });

      if (user) return user;

      const loggedUser = await currentUser();
      const firstname = loggedUser?.firstName ?? '';
      const lastname = loggedUser?.lastName ?? '';
      const email = loggedUser?.emailAddresses[0].emailAddress!;

      // Create user if first time
      const newUser = await db.user.create({
         data: {
            clerkUserId,
            firstname,
            lastname,
            email
         }
      });

      console.log(newUser);
      return newUser;
   }),
   getLoggedUser: publicProcedure.query(async ({ ctx }) => {
      const clerkUserId = ctx.session?.user.id;
      const res = await db.user.findFirst({
         where: { clerkUserId }
      });

      return res;
   })
});
