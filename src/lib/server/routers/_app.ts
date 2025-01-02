import { timersRouter } from './timers';
import { router } from '@/lib/server/trpc';

export const appRouter = router({
   timers: timersRouter
});

export type AppRouter = typeof appRouter;
