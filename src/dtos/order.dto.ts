import z from 'zod'

export const storeOrderSchema = z.object({
  userId: z.number().int(),
  regionId: z.number().int(),
  periodId: z.number().int(),
  amount: z.number(),
  currency: z.string().optional(),
  test: z.boolean().optional(),
  paid: z.boolean().optional(),
})

export type StoreOrderDto = z.infer<typeof storeOrderSchema>
