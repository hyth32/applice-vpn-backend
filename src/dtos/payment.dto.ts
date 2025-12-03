import z from 'zod'

export const storePaymentSchema = z.object({
  orderId: z.number().int(),
  externalId: z.string().nonempty(),
  status: z.string().nonempty(),
  amount: z.number(),
  currency: z.string().nonempty(),
  test: z.boolean().optional(),
})

export type StorePaymentDto = z.infer<typeof storePaymentSchema>
