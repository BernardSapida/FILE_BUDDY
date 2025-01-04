import { db } from '@/lib/db/index';
import { publicProcedure, router } from '@/lib/server/trpc';
import { z } from 'zod';

export const usersRouter = router({
   createUser: publicProcedure
      .input(
         z.object({
            clerkUserId: z.string().min(1, { message: 'Clerk uuid is required' }),
            firstname: z.string().min(1, { message: 'Firstname is required' }),
            lastname: z.string().min(1, { message: 'Lastname is required' }),
            email: z.string().min(1, { message: 'Email is required' })
         })
      )
      .mutation(async ({ input: { clerkUserId, firstname, lastname, email } }) => {
         const res = await db.user.create({
            data: {
               clerkUserId,
               firstname,
               lastname,
               email
            }
         });

         console.log(res);
      })
});
