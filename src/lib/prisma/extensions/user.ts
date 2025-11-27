import { PrismaClient } from '@prisma/client'

export const userExtension = (client: PrismaClient) => ({
  model: {
    user: {
      async freeKeyReceived(where: { id: number }) {
        const count = await client.key.count({
          where: {
            userId: where.id,
            free: true,
            deletedAt: null,
          },
        })
        return count > 0
      },
    },
  },
})
