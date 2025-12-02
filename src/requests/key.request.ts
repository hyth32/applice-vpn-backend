import z from 'zod'

export const createKeySchema = z.object({
  telegramId: z.string().nonempty(),
  regionId: z.number(),
  periodId: z.number(),
  quantity: z.number().default(1),
})

export type CreateKeyDto = z.infer<typeof createKeySchema>
