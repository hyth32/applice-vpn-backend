import { NextFunction, Request } from 'express'
import { PriceService } from '../services/price.service'
import { HttpError } from '../lib/errors/http-error'

const priceService = new PriceService()

export class PriceController {
  async list(req: Request, _res: any, next: NextFunction) {
    try {
      const regionId = Number(req.query.regionId)
      const periodId = Number(req.query.periodId)

      if (!Number.isFinite(regionId) || !Number.isFinite(periodId)) {
        throw new HttpError('regionId and periodId are required and must be numbers', 400)
      }

      const prices = await priceService.list(regionId, periodId)
      next({ success: true, data: prices })
    } catch (error) {
      next(error)
    }
  }
}
