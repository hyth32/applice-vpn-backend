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
  result: {
    key: {
      isExpired: {
        needs: { expirationDate: true },
        compute({ expirationDate }: { expirationDate: Date }) {
          const today = new Date()
          const expiration = new Date(expirationDate)

          today.setHours(0, 0, 0, 0)
          expiration.setHours(0, 0, 0, 0)

          return today > expiration
        },
      },
    },
  },
})
