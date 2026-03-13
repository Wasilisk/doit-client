import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";

export const tagZodSchema = z.object({
  name: z.string().nonempty("name.required"),
  color: z.string().nonempty("color.required"),
});

export type TagSchema = z.infer<typeof tagZodSchema>;
export const tagSchema = toTypedSchema(tagZodSchema);
