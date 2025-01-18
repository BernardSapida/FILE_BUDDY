import * as z from "zod"

export const todoSchema = z.object({
  id: z.string(),
  name: z.string(),
  finished: z.boolean(),
  clerkUserId: z.string(),
})
