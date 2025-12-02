import { Price } from '@prisma/client'
import { prisma } from '../lib/prisma'

export class PriceRepository {
  async findByRegionAndPeriod(regionId: number, periodId: number): Promise<Array<Pick<Price, 'amount' | 'quantity'>>> {
    return prisma.price.findMany({
      where: { regionId, periodId },
      select: { amount: true, quantity: true },
      orderBy: { quantity: 'asc' },
    })
  }
}
