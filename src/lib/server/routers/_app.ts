import { router } from '@/lib/server/trpc';
import { foldersRouter } from './folders';
import { filesRouter } from './files';
import { usersRouter } from './users';
import { todoRouter } from './todos';

export const appRouter = router({
   user: usersRouter,
   todo: todoRouter,
   folder: foldersRouter,
   file: filesRouter
});

export type AppRouter = typeof appRouter;
