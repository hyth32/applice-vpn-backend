import { User } from '@prisma/client'
import { prisma } from '../lib/prisma'
import { CreateUserDto } from '../requests/user.request'

export class UserRepository {
  async store(payload: CreateUserDto) {
    return prisma.user.create({
      data: payload,
    })
  }

  async findByTelegramIdOrThrow(telegramId: string): Promise<User> {
    const user = await prisma.user.findFirst({ where: { telegramId } })
    if (!user) {
      throw new Error('User not found')
    }
    return user
  }
}
