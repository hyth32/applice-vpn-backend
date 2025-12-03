import { prisma } from '../lib/prisma'
import { StorePaymentDto } from '../dtos/payment.dto'

export class PaymentRepository {
  async store(payload: StorePaymentDto) {
    return prisma.payment.create({
      data: payload,
    })
  }
}
