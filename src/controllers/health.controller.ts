import { NextFunction, Request } from 'express'
import { HealthService } from '../services/health.service'
import { HttpError } from '../lib/errors/http-error'

const healthService = new HealthService()

export class HealthController {
  async health(_req: Request, _res: any, next: NextFunction) {
    try {
      await healthService.check()
      next({ success: true, data: { status: 'ok' } })
    } catch (error) {
      next(new HttpError('Database unreachable', 500))
    }
  }
}
