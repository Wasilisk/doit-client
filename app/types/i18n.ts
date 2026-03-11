export const locales = ['en', 'ua'] as const

export type Locale = typeof locales[number]