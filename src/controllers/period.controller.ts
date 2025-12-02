import { NextFunction } from 'express'
import { z } from 'zod'
import { PeriodService } from '../services/period.service'
import { ValidatedRequest } from '../middlewares/validate'
import { listPeriodsQuerySchema } from '../requests/period.request'

const periodService = new PeriodService()

export class PeriodController {
  async list(req: ValidatedRequest<z.ZodTypeAny, typeof listPeriodsQuerySchema>, _res: any, next: NextFunction) {
    try {
      const periods = await periodService.list(req.validated.query.telegramId)
      next({ success: true, data: periods })
    } catch (error) {
      next(error)
    }
  }
}
