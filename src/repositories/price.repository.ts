import { prisma } from '../lib/prisma'

export class PriceRepository {
  async findByRegionAndPeriod(regionId: number, periodId: number): Promise<Array<{ quantity: number; price: number }>> {
    const prices = await prisma.price.findMany({
      where: { regionId, periodId },
      select: { amount: true, quantity: true },
      orderBy: { quantity: 'asc' },
    })

    return prices.map(({ amount, quantity }) => ({ quantity, price: amount }))
  }

  async findByRegionPeriodAndQuantity(regionId: number, periodId: number, quantity: number) {
    return prisma.price.findFirst({
      where: { regionId, periodId, quantity },
      include: { region: true, period: true },
    })
  }
}
