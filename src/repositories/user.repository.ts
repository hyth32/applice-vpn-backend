import { prisma } from '../lib/prisma'
import { CreateUserDto } from '../requests/user.request'

export class UserRepository {
  async store(payload: CreateUserDto) {
    return prisma.user.create({
      data: payload,
    })
  }

  async findByTelegramId(telegramId: string) {
    return prisma.user.findFirst({
      where: { telegramId },
    })
  }
}
