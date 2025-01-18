import { db } from '@/lib/db/index';
import { publicProcedure, router } from '@/lib/server/trpc';
import { z } from 'zod';

export const todoRouter = router({
   getTodos: publicProcedure.query(async ({ ctx }) => {
      const clerkUserId = ctx.session?.user.id!;
      const res = await db.todo.findMany({
         where: { clerkUserId }
      });

      return res;
   }),
   createTodo: publicProcedure
      .input(
         z.object({
            name: z.string().min(1, { message: 'Todo name is required' })
         })
      )
      .mutation(async ({ input: { name }, ctx }) => {
         const clerkUserId = ctx.session?.user.id!;
         const res = await db.todo.create({
            data: {
               name,
               finished: false,
               clerkUserId
            }
         });

         return res;
      }),
   checkTodo: publicProcedure
      .input(
         z.object({
            id: z.string().min(1, { message: 'Todo id is required' }),
            finished: z.boolean()
         })
      )
      .mutation(async ({ input: { id, finished } }) => {
         const res = await db.todo.update({
            where: { id },
            data: { finished }
         });

         return res;
      }),
   deleteTodo: publicProcedure
      .input(
         z.object({
            id: z.string().min(1, { message: 'Todo id is required' })
         })
      )
      .mutation(async ({ input: { id } }) => {
         const res = await db.todo.delete({
            where: { id }
         });

         return res;
      })
});
