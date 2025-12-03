import { WireguardService } from './wireguard.service'
import { UserRepository } from '../repositories/user.repository'
import { KeyRepository } from '../repositories/key.repository'
import { CreateKeyDto } from '../requests/key.request'
import { OrderRepository } from '../repositories/order.repository'
import { StoreOrderDto } from '../dtos/order.dto'
import { RegionRepository } from '../repositories/region.repository'
import { PeriodRepository } from '../repositories/period.repository'
import { PriceRepository } from '../repositories/price.repository'
import { HttpError } from '../lib/errors/http-error'
import { PaymentRepository } from '../repositories/payment.repository'
import { YookassaService } from './yookassa.service'
import { CreateFreeKeyDto } from '../requests/key.request'

const wireguardService = new WireguardService()
const userRepository = new UserRepository()
const regionRepository = new RegionRepository()
const periodRepository = new PeriodRepository()
const keyRepository = new KeyRepository()
const orderRepository = new OrderRepository()
const priceRepository = new PriceRepository()
const paymentRepository = new PaymentRepository()
const yookassaService = new YookassaService()

const DEFAULT_CURRENCY = process.env.YOOKASSA_CURRENCY || 'RUB'
const DEFAULT_TEST_MODE = process.env.YOOKASSA_TEST_MODE === 'true'

export class KeyService {
  async create(payload: CreateKeyDto): Promise<{
    region: string
    period: string
    quantity: number
    amount: number
    payment_link: string
  }> {
    const user = await userRepository.findByTelegramIdOrThrow(payload.telegramId)

    const price = await priceRepository.findByRegionPeriodAndQuantity(payload.regionId, payload.periodId, payload.quantity)

    if (!price) {
      throw new HttpError('Price not found', 404)
    }

    const region = price.region ?? (await regionRepository.findByIdOrThrow(price.regionId))
    const period = price.period ?? (await periodRepository.findByIdOrThrow(price.periodId))

    const orderPayload: StoreOrderDto = {
      userId: user.id,
      regionId: region.id,
      periodId: period.id,
      amount: price.amount,
      currency: DEFAULT_CURRENCY,
      test: DEFAULT_TEST_MODE,
    }

    const order = await orderRepository.store(orderPayload)

    const payment = await yookassaService.createPayment({
      amount: price.amount,
      currency: DEFAULT_CURRENCY,
      description: `${region.name} / ${period.name} x${payload.quantity}`,
      metadata: {
        orderId: order.id,
        telegramId: payload.telegramId,
      },
    })

    const paymentLink = payment.confirmation?.confirmation_url

    if (!paymentLink) {
      throw new HttpError('Payment link was not received', 502)
    }

    await paymentRepository.store({
      orderId: order.id,
      externalId: payment.id,
      status: payment.status,
      amount: Number(payment.amount.value),
      currency: payment.amount.currency,
      test: payment.test ?? DEFAULT_TEST_MODE,
    })

    return {
      region: region.name,
      period: period.name,
      quantity: payload.quantity,
      amount: price.amount,
      payment_link: paymentLink,
    }
  }

  async createFree(payload: CreateFreeKeyDto): Promise<void> {
    const user = await userRepository.findByTelegramIdOrThrow(payload.telegramId)
    const region = await regionRepository.findByIdOrThrow(payload.regionId)
    const period = await periodRepository.findByNameOrThrow('free')

    const alreadyHasFreeKey = await userRepository.freeKeyReceived(user.id)
    if (alreadyHasFreeKey) {
      throw new HttpError('Free key already received', 400)
    }

    const orderPayload: StoreOrderDto = {
      userId: user.id,
      regionId: region.id,
      periodId: period.id,
      amount: 0,
      currency: DEFAULT_CURRENCY,
      paid: true,
    }

    const order = await orderRepository.store(orderPayload)

    const displayName = user.username ?? user.name ?? payload.telegramId
    const config = await wireguardService.createPeer(displayName)

    await keyRepository.store({
      userId: user.id,
      orderId: order.id,
      regionId: region.id,
      periodId: period.id,
      free: true,
      configId: config.Identifier,
      configName: config.DisplayName,
      expirationDate: new Date(config.ExpiresAt),
    })
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
