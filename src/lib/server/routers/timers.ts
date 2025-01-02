import { db } from '@/lib/db/index';
import { publicProcedure, router } from '@/lib/server/trpc';
import { deductHours } from '@/lib/utils';
import { Prisma } from '@prisma/client';
import { z } from 'zod';

export const timersRouter = router({
   getTimers: publicProcedure.query(async () => {
      const timers = await db.timer.findMany({
         include: {
            builders: {
               include: {
                  time_duration: true
               }
            }
         },
         orderBy: {
            name: 'asc'
         }
      });

      // Custom league order
      const leagueOrder = [
         'BRONZE',
         'SILVER',
         'GOLD',
         'CRYSTAL',
         'MASTER',
         'CHAMPION',
         'TITAN',
         'LEGEND'
      ];

      // Sort the fetched timers by custom league order
      timers.sort((a, b) => leagueOrder.indexOf(b.league) - leagueOrder.indexOf(a.league));

      // Manually sort builders by the combined time of days, hours, and minutes
      const sortedTimers = timers.map((timer) => ({
         ...timer,
         builders: timer.builders.sort((a, b) => {
            // Calculate total minutes for each builder's time duration
            const totalMinutesA =
               a.time_duration.days * 24 * 60 +
               a.time_duration.hours * 60 +
               a.time_duration.minutes;
            const totalMinutesB =
               b.time_duration.days * 24 * 60 +
               b.time_duration.hours * 60 +
               b.time_duration.minutes;

            // Sort by total minutes
            return totalMinutesA - totalMinutesB;
         })
      }));

      return sortedTimers;
   }),
   deleteTimer: publicProcedure
      .input(
         z.object({
            id: z.string().min(1, { message: 'Timer id is required' })
         })
      )
      .mutation(async ({ input }) => {
         // First, find all Builders associated with the Timer
         const builders = await db.builder.findMany({
            where: { timerId: input.id }
         });

         // Delete all associated Builders and their TimeDurations
         for (const builder of builders) {
            // Delete the Builder
            await db.builder.delete({
               where: {
                  id: builder.id
               }
            });

            // Delete the associated TimeDuration for each Builder
            await db.timeDuration.delete({
               where: {
                  id: builder.timeDurationId
               }
            });
         }

         const timerDeleteResponse = await db.timer.delete({
            where: {
               id: input.id
            }
         });
      }),
   createTimer: publicProcedure
      .input(
         z.object({
            name: z.string().min(1, { message: 'Name is required' }),
            builder_apprentice_level: z.coerce
               .number()
               .min(1, { message: 'Apprentice level must be at least 1' }),
            league: z.enum(
               ['BRONZE', 'SILVER', 'GOLD', 'CRYSTAL', 'MASTER', 'CHAMPION', 'TITAN', 'LEGEND'],
               {
                  errorMap: () => ({
                     message: 'League is required'
                  })
               }
            ),
            goldpass: z.boolean(),
            builders: z.array(
               z.object({
                  title: z.string().min(1, { message: 'Title is required' }),
                  upgrade_type: z.enum(['BUILDING', 'LABORATORY'], {
                     errorMap: () => ({
                        message:
                           'Upgrade type is required and must be either BUILDING or LABORATORY'
                     })
                  }),
                  time_duration: z
                     .object({
                        days: z.coerce.number().min(0, { message: 'Days must be at least 0' }),
                        hours: z.coerce
                           .number()
                           .min(0, { message: 'Hours must be at least 0' })
                           .max(23, { message: 'Hours must be less than 24' }),
                        minutes: z.coerce
                           .number()
                           .min(0, { message: 'Minutes must be at least 0' })
                           .max(59, { message: 'Minutes must be less than 60' })
                     })
                     .refine((data) => data.days !== 0 || data.hours !== 0 || data.minutes !== 0, {
                        message: 'At least one of days, hours, or minutes must be non-zero',
                        path: ['days', 'hours', 'minutes']
                     })
               })
            )
         })
      )
      .mutation(async ({ input }) => {
         const res = await db.timer.create({
            data: {
               name: input.name,
               builder_apprentice_level: input.builder_apprentice_level,
               league: input.league,
               goldpass: input.goldpass,
               builders: {
                  create: input.builders.map((builder: any) => ({
                     title: builder.title,
                     started_date: new Date(),
                     upgrade_type: builder.upgrade_type,
                     time_duration: {
                        create: {
                           days: builder.time_duration.days,
                           hours: builder.time_duration.hours,
                           minutes: builder.time_duration.minutes
                        }
                     }
                  }))
               }
            }
         });

         return res;
      }),
   updateTimerInfo: publicProcedure
      .input(
         z.object({
            id: z.string().min(1, { message: 'Timer id is required' }),
            name: z.string().min(1, { message: 'Name is required' }),
            league: z.enum(
               ['BRONZE', 'SILVER', 'GOLD', 'CRYSTAL', 'MASTER', 'CHAMPION', 'TITAN', 'LEGEND'],
               {
                  errorMap: () => ({
                     message: 'League is required'
                  })
               }
            ),
            builder_apprentice_level: z.coerce
               .number()
               .min(1, { message: 'Apprentice level must be at least 1' }),
            goldpass: z.boolean()
         })
      )
      .mutation(async ({ input }) => {
         console.log(input);
         const res = await db.timer.update({
            where: {
               id: input.id
            },
            data: {
               name: input.name,
               builder_apprentice_level: input.builder_apprentice_level,
               league: input.league,
               goldpass: input.goldpass
            }
         });

         return res;
      }),
   addBuilderTime: publicProcedure
      .input(
         z.object({
            id: z.string().min(1, { message: 'Builder id is required' }),
            title: z.string().min(1, { message: 'Title is required' }),
            upgrade_type: z.enum(['BUILDING', 'LABORATORY'], {
               errorMap: () => ({
                  message: 'Upgrade type is required and must be either BUILDING or LABORATORY'
               })
            }),
            time_duration: z
               .object({
                  days: z.coerce.number().min(0, { message: 'Days must be at least 0' }),
                  hours: z.coerce
                     .number()
                     .min(0, { message: 'Hours must be at least 0' })
                     .max(23, { message: 'Hours must be less than 24' }),
                  minutes: z.coerce
                     .number()
                     .min(0, { message: 'Minutes must be at least 0' })
                     .max(59, { message: 'Minutes must be less than 60' })
               })
               .refine((data) => data.days !== 0 || data.hours !== 0 || data.minutes !== 0, {
                  message: 'At least one of days, hours, or minutes must be non-zero',
                  path: ['days', 'hours', 'minutes']
               })
         })
      )
      .mutation(async ({ input }) => {
         const timeDurationId = await db.timeDuration.create({
            data: {
               days: input.time_duration.days,
               hours: input.time_duration.hours,
               minutes: input.time_duration.minutes
            }
         });

         const res = await db.builder.create({
            data: {
               title: input.title,
               upgrade_type: input.upgrade_type,
               started_date: new Date(),
               timeDurationId: timeDurationId.id,
               timerId: input.id
            }
         });

         return res;
      }),
   startBuilderTime: publicProcedure
      .input(
         z.object({
            id: z.string().min(1, { message: 'Builder id is required' }),
            title: z.string().min(1, { message: 'Title is required' }),
            upgrade_type: z.enum(['BUILDING', 'LABORATORY'], {
               errorMap: () => ({
                  message: 'Upgrade type is required and must be either BUILDING or LABORATORY'
               })
            }),
            time_duration: z
               .object({
                  days: z.coerce.number().min(0, { message: 'Days must be at least 0' }),
                  hours: z.coerce
                     .number()
                     .min(0, { message: 'Hours must be at least 0' })
                     .max(23, { message: 'Hours must be less than 24' }),
                  minutes: z.coerce
                     .number()
                     .min(0, { message: 'Minutes must be at least 0' })
                     .max(59, { message: 'Minutes must be less than 60' })
               })
               .refine((data) => data.days !== 0 || data.hours !== 0 || data.minutes !== 0, {
                  message: 'At least one of days, hours, or minutes must be non-zero',
                  path: ['days', 'hours', 'minutes']
               })
         })
      )
      .mutation(async ({ input }) => {
         const res = await db.builder.update({
            where: {
               id: input.id
            },
            data: {
               title: input.title,
               started_date: new Date(),
               upgrade_type: input.upgrade_type,
               time_duration: {
                  update: {
                     days: input.time_duration.days,
                     hours: input.time_duration.hours,
                     minutes: input.time_duration.minutes
                  }
               }
            }
         });

         console.log(res);
         console.log({
            days: input.time_duration.days,
            hours: input.time_duration.hours,
            minutes: input.time_duration.minutes
         });

         return res;
      }),
   resetBuilderTime: publicProcedure
      .input(
         z.object({
            id: z.string().min(1, { message: 'Builder id is required' }),
            title: z.string().min(1, { message: 'Title is required' })
         })
      )
      .mutation(async ({ input }) => {
         const res = await db.builder.update({
            where: {
               id: input.id
            },
            data: {
               title: input.title,
               time_duration: {
                  update: {
                     days: 0,
                     hours: 0,
                     minutes: 0
                  }
               }
            }
         });

         return res;
      }),
   deleteBuilderTime: publicProcedure
      .input(
         z.object({
            id: z.string().min(1, { message: 'Builder id is required' })
         })
      )
      .mutation(async ({ input }) => {
         const builder = await db.builder.findFirst({
            where: {
               id: input.id
            }
         });

         await db.builder.delete({
            where: {
               id: input.id
            }
         });

         await db.timeDuration.delete({
            where: {
               id: builder?.timeDurationId
            }
         });
      }),
   boostApprentice: publicProcedure
      .input(
         z.object({
            id: z.string().min(1, { message: 'Timer id is required' }),
            hoursDeduction: z.number()
         })
      )
      .mutation(async ({ input }) => {
         // First, find all Builders associated with the Timer
         const builder = await db.builder.findFirst({
            where: { id: input.id }
         });

         // Update builder time duration
         const timeDuration = await db.timeDuration.findFirst({
            where: { id: builder?.timeDurationId }
         });

         const newTime = deductHours(
            {
               days: timeDuration?.days ?? 0,
               hours: timeDuration?.hours ?? 0,
               minutes: timeDuration?.minutes ?? 0
            },
            input.hoursDeduction
         );

         // Update builder time duration
         await db.timeDuration.update({
            where: {
               id: builder?.timeDurationId
            },
            data: newTime
         });
      }),
   boostUpgrade: publicProcedure
      .input(
         z.object({
            id: z.string().min(1, { message: 'Timer id is required' }),
            upgrade_type: z.enum(['BUILDING', 'LABORATORY'], {
               errorMap: () => ({
                  message: 'Upgrade type is required and must be either BUILDING or LABORATORY'
               })
            }),
            hoursDeduction: z.number()
         })
      )
      .mutation(async ({ input }) => {
         // First, find all Builders associated with the Timer
         const builders = await db.builder.findMany({
            where: { timerId: input.id, upgrade_type: input.upgrade_type }
         });

         // Update all associated Builders and their TimeDurations
         for (const builder of builders) {
            // Update builder time duration
            const timeDuration = await db.timeDuration.findFirst({
               where: { id: builder.timeDurationId }
            });

            const newTime = deductHours(
               {
                  days: timeDuration?.days ?? 0,
                  hours: timeDuration?.hours ?? 0,
                  minutes: timeDuration?.minutes ?? 0
               },
               input.hoursDeduction
            );

            // Update builder time duration
            await db.timeDuration.update({
               where: {
                  id: builder.timeDurationId
               },
               data: newTime
            });
         }
      })
});
