import { WireguardService } from './wireguard.service'
import { UserRepository } from '../repositories/user.repository'
import { KeyRepository } from '../repositories/key.repository'
import { Key } from '@prisma/client'
import { CreateKeyDto } from '../requests/key.request'
import { prisma } from '../lib/prisma'
import { OrderRepository } from '../repositories/order.repository'

const wireguardService = new WireguardService()
const userRepository = new UserRepository()
const keyRepository = new KeyRepository()
const orderRepository = new OrderRepository()

export class KeyService {
  async create(payload: CreateKeyDto): Promise<{ key: Key; created: boolean }> {
    const user = await userRepository.findByTelegramId(payload.telegramId)
    if (!user) {
      throw new Error('User not found')
    }
    const displayName = user.username ?? user.name ?? payload.telegramId

    const region = await prisma.region.findUnique({ where: { id: payload.regionId } })
    if (!region) {
      throw new Error('Region not found')
    }

    const period = await prisma.period.findUnique({ where: { id: payload.periodId } })
    if (!period) {
      throw new Error('Period not found')
    }

    const order = await orderRepository.store({
      userId: user.id,
      regionId: region.id,
      periodId: period.id,
      amount: '100',
    })

    const config = await wireguardService.createPeer(displayName)

    const key = await keyRepository.store({
      userId: user.id,
      orderId: order.id,
      regionId: region.id,
      periodId: period.id,
      free: false,
      configId: config.Identifier,
      configName: config.DisplayName,
      expirationDate: new Date(config.ExpiresAt),
    })
    return { key, created: true }
  }
}
