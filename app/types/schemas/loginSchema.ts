import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'

export const loginZodSchema = z.object({
    email: z.string().nonempty('email.required').email('email.invalid'),
    password: z.string().min(6, 'password.minLength'),
})

export type LoginSchema = z.infer<typeof loginZodSchema>
export const loginSchema = toTypedSchema(loginZodSchema)