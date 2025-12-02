import { NextFunction, Request } from 'express'
import { PeriodService } from '../services/period.service'
import { HttpError } from '../lib/errors/http-error'

const periodService = new PeriodService()

export class PeriodController {
  async list(req: Request, _res: any, next: NextFunction) {
    try {
      const telegramId = typeof req.query.telegramId === 'string' ? req.query.telegramId : null

      if (!telegramId) {
        throw new HttpError('telegramId is required', 400)
      }

      const periods = await periodService.list(telegramId)
      next({ success: true, data: periods })
    } catch (error) {
      next(error)
    }
  }
}
