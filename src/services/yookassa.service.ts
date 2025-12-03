import crypto from 'crypto'
import { ICreatePayment, Payment, YooCheckout } from '@a2seven/yoo-checkout'
import { HttpError } from '../lib/errors/http-error'

type CreatePaymentPayload = {
  amount: number
  currency: string
  description: string
  metadata?: Record<string, unknown>
}

export class YookassaService {
  private client: YooCheckout
  private returnUrl: string

  constructor() {
    const shopId = process.env.YOOKASSA_SHOP_ID
    const secretKey = process.env.YOOKASSA_SECRET_KEY
    const returnUrl = process.env.YOOKASSA_RETURN_URL

    if (!shopId || !secretKey) {
      throw new HttpError('YooKassa credentials are not configured', 500)
    }

    if (!returnUrl) {
      throw new HttpError('YooKassa return URL is not configured', 500)
    }

    this.client = new YooCheckout({ shopId, secretKey })
    this.returnUrl = returnUrl
  }

  async createPayment(payload: CreatePaymentPayload): Promise<Payment> {
    const paymentPayload: ICreatePayment = {
      amount: {
        value: payload.amount.toFixed(2),
        currency: payload.currency,
      },
      confirmation: {
        type: 'redirect',
        return_url: this.returnUrl,
      },
      capture: true,
      description: payload.description,
      metadata: payload.metadata,
    }

    try {
      return await this.client.createPayment(paymentPayload, crypto.randomUUID())
    } catch (error) {
      throw new HttpError('Failed to create payment in YooKassa', 502)
    }
  }
}
