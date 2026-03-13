import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";

export const tagZodSchema = z.object({
  name: z.string().nonempty("tagName.required"),
  color: z.string().nonempty("tagColor.required"),
});

export type TagSchema = z.infer<typeof tagZodSchema>;
export const tagSchema = toTypedSchema(tagZodSchema);
