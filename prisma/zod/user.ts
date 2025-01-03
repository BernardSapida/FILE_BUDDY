import * as z from "zod"
import { CompleteFolder, relatedFolderSchema } from "./index"

export const userSchema = z.object({
  id: z.string(),
  clerkUserId: z.string(),
  type: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  email: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteUser extends z.infer<typeof userSchema> {
  folders: CompleteFolder[]
}

/**
 * relatedUserSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedUserSchema: z.ZodSchema<CompleteUser> = z.lazy(() => userSchema.extend({
  folders: relatedFolderSchema.array(),
}))
