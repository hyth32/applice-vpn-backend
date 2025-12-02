import { User } from '@prisma/client'
import { prisma } from '../lib/prisma'
import { CreateUserDto } from '../requests/user.request'
import { HttpError } from '../lib/errors/http-error'

export class UserRepository {
  async store(payload: CreateUserDto) {
    return prisma.user.create({
      data: payload,
    })
  }

  async findByTelegramId(telegramId: string): Promise<User | null> {
    return prisma.user.findFirst({ where: { telegramId } })
  }

  async findByTelegramIdOrThrow(telegramId: string): Promise<User> {
    const user = await this.findByTelegramId(telegramId)
    if (!user) {
      throw new HttpError('User not found', 404)
    }
    return user
  }
}
