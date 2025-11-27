import { prisma } from '../lib/prisma'

type UserPayload = {
  name?: string | null
  telegramId?: string | null
  username?: string | null
}

export class UserRepository {
  async store({ name, telegramId, username }: UserPayload) {
    return prisma.user.create({
      data: {
        name,
        telegramId,
        username,
      },
    })
  }

  async findByTelegramId(telegramId: string) {
    return prisma.user.findFirst({
      where: { telegramId },
    })
  }
}
