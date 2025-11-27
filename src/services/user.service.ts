import { User } from '@prisma/client'
import { UserRepository } from '../repositories/user.repository'

const userRepository = new UserRepository()

type CreateUserPayload = {
  telegramId: string
  name?: string | null
  username?: string | null
}

export class UserService {
  async create(payload: CreateUserPayload): Promise<{ user: User; created: boolean }> {
    const existing = await userRepository.findByTelegramId(payload.telegramId)
    if (existing) {
      return { user: existing, created: false }
    }

    const user = await userRepository.store(payload)

    return { user, created: true }
  }
}
