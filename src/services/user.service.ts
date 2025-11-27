import { User } from '@prisma/client'
import { CreateUserDto } from '../requests/user.request'
import { UserRepository } from '../repositories/user.repository'

const userRepository = new UserRepository()

export class UserService {
  async create(payload: CreateUserDto): Promise<{ user: User; created: boolean }> {
    const existing = await userRepository.findByTelegramId(payload.telegramId)
    if (existing) {
      return { user: existing, created: false }
    }

    const user = await userRepository.store(payload)

    return { user, created: true }
  }
}
