import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'

export const registerZodSchema = z.object({
    email: z.string().nonempty('email.required').email('email.invalid'),
    fullName: z.string().nonempty('fullName.required'),
    password: z.string().min(6, 'password.minLength'),
    confirmPassword: z.string().nonempty('confirmPassword.required'),
}).refine(
    (data) => data.password === data.confirmPassword,
    { message: 'confirmPassword.notMatch', path: ['confirmPassword'] }
)

export type RegisterSchema = z.infer<typeof registerZodSchema>
export const registerSchema = toTypedSchema(registerZodSchema)