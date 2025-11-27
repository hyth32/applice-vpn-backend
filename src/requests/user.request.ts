import { z } from 'zod'

export const createUserSchema = z.object({
  telegramId: z.string().nonempty(),
  name: z.string().nullable().optional(),
  username: z.string().nullable().optional(),
})

export type CreateUserDto = z.infer<typeof createUserSchema>
