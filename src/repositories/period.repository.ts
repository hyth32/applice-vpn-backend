import { Period } from '@prisma/client'
import { prisma } from '../lib/prisma'

export class PeriodRepository {
  async findByIdOrThrow(id: number): Promise<Period> {
    const period = await prisma.period.findUnique({ where: { id } })
    if (!period) {
      throw new Error('Period not found')
    }
    return period
  }
}
