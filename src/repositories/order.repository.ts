import { prisma } from '../lib/prisma'

export class OrderRepository {
  async store(payload: any) {
    return prisma.order.create({
      data: payload,
    })
  }
}
