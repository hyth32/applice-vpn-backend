import { prisma } from '../lib/prisma'
import { StoreOrderDto } from '../dtos/order.dto'

export class OrderRepository {
  async store(payload: StoreOrderDto) {
    return prisma.order.create({
      data: payload,
    })
  }
}
