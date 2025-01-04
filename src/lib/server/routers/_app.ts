import { router } from '@/lib/server/trpc';
import { foldersRouter } from './folders';
import { filesRouter } from './files';
import { usersRouter } from './users';

export const appRouter = router({
   user: usersRouter,
   folder: foldersRouter,
   file: filesRouter
});

export type AppRouter = typeof appRouter;
