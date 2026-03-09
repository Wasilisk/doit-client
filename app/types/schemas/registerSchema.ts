import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'

export const registerZodSchema = z.object({
    email: z.string().min(1, 'validation.email.required').email('validation.email.invalid'),
    fullName: z.string().min(1, 'validation.fullName.required'),
    password: z.string().min(6, 'validation.password.minLength'),
    confirmPassword: z.string()
}).refine(
    (data) => data.password === data.confirmPassword,
    { message: 'validation.confirmPassword.notMatch', path: ['confirmPassword'] }
)

export type RegisterSchema = z.infer<typeof registerZodSchema>
export const registerSchema = toTypedSchema(registerZodSchema)