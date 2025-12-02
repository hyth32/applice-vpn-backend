import { Period } from '@prisma/client'
import { prisma } from '../lib/prisma'
import { HttpError } from '../lib/errors/http-error'

export class PeriodRepository {
  async findByIdOrThrow(id: number): Promise<Period> {
    const period = await prisma.period.findUnique({ where: { id } })
    if (!period) {
      throw new HttpError('Period not found', 404)
    }
    return period
  }
}
