import { z } from 'zod'

export const listPeriodsQuerySchema = z.object({
  telegramId: z.string().nonempty(),
})
