import { Period } from '@prisma/client'
import { PeriodRepository } from '../repositories/period.repository'
import { UserRepository } from '../repositories/user.repository'
import { prisma } from '../lib/prisma'

const periodRepository = new PeriodRepository()
const userRepository = new UserRepository()

export class PeriodService {
  async list(telegramId: string): Promise<Array<Pick<Period, 'id' | 'name' | 'discount'>>> {
    const user = await userRepository.findByTelegramIdOrThrow(telegramId)
    const hasFreeKey = await prisma.user.freeKeyReceived({ id: user.id })

    const periods = await periodRepository.findMany()
    if (!hasFreeKey) {
      return periods
    }

    return periods.filter((period) => period.name !== 'free')
  }
}
