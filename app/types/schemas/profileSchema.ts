import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";

export const profileZodSchema = z.object({
  fullName: z.string().nonempty("fullName.required"),
});

export type ProfileSchema = z.infer<typeof profileZodSchema>;
export const profileSchema = toTypedSchema(profileZodSchema);
