import z from 'zod'

export const createKeySchema = z.object({
  telegramId: z.string().nonempty(),
  regionId: z.number(),
  periodId: z.number(),
  quantity: z.number().default(1),
})

export const listKeysQuerySchema = z.object({
  telegramId: z.string().nonempty(),
})

export const showKeyParamsSchema = z.object({
  keyId: z.coerce.number().int().positive(),
})

export const showKeyQuerySchema = z.object({
  telegramId: z.string().nonempty(),
})

export type CreateKeyDto = z.infer<typeof createKeySchema>
