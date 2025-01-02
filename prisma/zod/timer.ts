import * as z from "zod"
import { League } from "@prisma/client"
import { CompleteBuilder, relatedBuilderSchema } from "./index"

export const timerSchema = z.object({
  id: z.string(),
  name: z.string(),
  goldpass: z.boolean(),
  league: z.nativeEnum(League),
  builder_apprentice_level: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteTimer extends z.infer<typeof timerSchema> {
  builders: CompleteBuilder[]
}

/**
 * relatedTimerSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedTimerSchema: z.ZodSchema<CompleteTimer> = z.lazy(() => timerSchema.extend({
  builders: relatedBuilderSchema.array(),
}))
