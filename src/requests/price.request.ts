import { z } from 'zod'

export const listPricesQuerySchema = z.object({
  regionId: z.coerce.number().int().positive(),
  periodId: z.coerce.number().int().positive(),
})
