import { PrismaClient } from '@prisma/client'

export const orderExtension = (client: PrismaClient) => ({
  model: {
    order: {
      async softDelete(where: { id: number }) {
        return client.order.update({
          where,
          data: { deletedAt: new Date() },
        })
      },
    },
  },
})
