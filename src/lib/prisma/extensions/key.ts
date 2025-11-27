import { PrismaClient } from '@prisma/client'

export const keyExtension = (client: PrismaClient) => ({
  model: {
    key: {
      async softDelete(where: { id: number }) {
        return client.key.update({
          where,
          data: { deletedAt: new Date() },
        })
      },
    },
  },
})
