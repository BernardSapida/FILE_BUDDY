import * as z from "zod"
import { TagColor } from "@prisma/client"
import { CompleteFolder, relatedFolderSchema } from "./index"

export const fileSchema = z.object({
  id: z.string(),
  filename: z.string(),
  asset_id: z.string(),
  public_id: z.string(),
  bytes: z.number().int(),
  type: z.string(),
  tag: z.string(),
  tag_color: z.nativeEnum(TagColor),
  secure_url: z.string(),
  favorited: z.boolean(),
  archived: z.boolean(),
  trashed: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  folderId: z.string(),
})

export interface CompleteFile extends z.infer<typeof fileSchema> {
  folder: CompleteFolder
}

/**
 * relatedFileSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedFileSchema: z.ZodSchema<CompleteFile> = z.lazy(() => fileSchema.extend({
  folder: relatedFolderSchema,
}))
