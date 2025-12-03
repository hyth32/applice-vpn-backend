import { Key } from '@prisma/client'
import { WireguardService } from './wireguard.service'
import { UserRepository } from '../repositories/user.repository'
import { KeyRepository } from '../repositories/key.repository'
import { CreateKeyDto } from '../requests/key.request'
import { OrderRepository } from '../repositories/order.repository'
import { StoreOrderDto } from '../dtos/order.dto'
import { RegionRepository } from '../repositories/region.repository'
import { PeriodRepository } from '../repositories/period.repository'

const wireguardService = new WireguardService()
const userRepository = new UserRepository()
const regionRepository = new RegionRepository()
const periodRepository = new PeriodRepository()
const keyRepository = new KeyRepository()
const orderRepository = new OrderRepository()

export class KeyService {
  async create(payload: CreateKeyDto): Promise<{ key: Key; created: boolean }> {
    const user = await userRepository.findByTelegramIdOrThrow(payload.telegramId)
    const region = await regionRepository.findByIdOrThrow(payload.regionId)
    const period = await periodRepository.findByIdOrThrow(payload.periodId)

    const displayName = user.username ?? user.name ?? payload.telegramId

    const orderPayload: StoreOrderDto = {
      userId: user.id,
      regionId: region.id,
      periodId: period.id,
      amount: 100,
    }

    const order = await orderRepository.store(orderPayload)

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

  async show(keyId: number) {
    return await keyRepository.findByIdOrThrow(keyId)
  }

  async getConfig(keyId: number) {
    const configId = await keyRepository.getConfigId(keyId)
    return await wireguardService.getPeer(configId)
  }

  async deleteKey(keyId: number) {
    const configId = await keyRepository.getConfigId(keyId)
    await keyRepository.deleteKey(keyId)
    try {
      await wireguardService.deletePeer(configId)
    } catch (error) {
      return
    }
  }
}
