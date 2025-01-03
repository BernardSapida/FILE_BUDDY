import * as z from "zod"
import { CompleteFile, relatedFileSchema, CompleteUser, relatedUserSchema } from "./index"

export const folderSchema = z.object({
  id: z.string(),
  folder_name: z.string(),
  favorited: z.boolean(),
  trashed: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string(),
})

export interface CompleteFolder extends z.infer<typeof folderSchema> {
  files: CompleteFile[]
  user: CompleteUser
}

/**
 * relatedFolderSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedFolderSchema: z.ZodSchema<CompleteFolder> = z.lazy(() => folderSchema.extend({
  files: relatedFileSchema.array(),
  user: relatedUserSchema,
}))
