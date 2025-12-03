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

  async findMany(): Promise<Array<Pick<Period, 'id' | 'name' | 'discount'>>> {
    return prisma.period.findMany({
      select: { id: true, name: true, discount: true },
      orderBy: { id: 'asc' },
    })
  }

  async findByNameOrThrow(name: string): Promise<Period> {
    const period = await prisma.period.findFirst({ where: { name } })
    if (!period) {
      throw new HttpError('Period not found', 404)
    }
    return period
  }
}
