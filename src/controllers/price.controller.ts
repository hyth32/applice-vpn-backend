import { NextFunction } from 'express'
import { z } from 'zod'
import { PriceService } from '../services/price.service'
import { ValidatedRequest } from '../middlewares/validate'
import { listPricesQuerySchema } from '../requests/price.request'

const priceService = new PriceService()

export class PriceController {
  async list(req: ValidatedRequest<unknown, z.infer<typeof listPricesQuerySchema>>, _res: any, next: NextFunction) {
    try {
      const prices = await priceService.list(req.validated.query.regionId, req.validated.query.periodId)
      next({ success: true, data: prices })
    } catch (error) {
      next(error)
    }
  }
}
