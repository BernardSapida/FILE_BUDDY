import * as z from "zod"
import { CompleteBuilder, relatedBuilderSchema } from "./index"

export const timeDurationSchema = z.object({
  id: z.string(),
  days: z.number().int(),
  hours: z.number().int(),
  minutes: z.number().int(),
})

export interface CompleteTimeDuration extends z.infer<typeof timeDurationSchema> {
  Builder?: CompleteBuilder | null
}

/**
 * relatedTimeDurationSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedTimeDurationSchema: z.ZodSchema<CompleteTimeDuration> = z.lazy(() => timeDurationSchema.extend({
  Builder: relatedBuilderSchema.nullish(),
}))
