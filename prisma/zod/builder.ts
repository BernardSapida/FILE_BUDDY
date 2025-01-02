import * as z from "zod"
import { UpgradeType } from "@prisma/client"
import { CompleteTimeDuration, relatedTimeDurationSchema, CompleteTimer, relatedTimerSchema } from "./index"

export const builderSchema = z.object({
  id: z.string(),
  timerId: z.string(),
  title: z.string(),
  started_date: z.date(),
  upgrade_type: z.nativeEnum(UpgradeType),
  timeDurationId: z.string(),
})

export interface CompleteBuilder extends z.infer<typeof builderSchema> {
  time_duration: CompleteTimeDuration
  Timer: CompleteTimer
}

/**
 * relatedBuilderSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedBuilderSchema: z.ZodSchema<CompleteBuilder> = z.lazy(() => builderSchema.extend({
  time_duration: relatedTimeDurationSchema,
  Timer: relatedTimerSchema,
}))
