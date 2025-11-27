import { Request, Response } from 'express'
import { HealthService } from '../services/health.service'

const healthService = new HealthService()

export class HealthController {
  async health(_req: Request, res: Response) {
    try {
      await healthService.check()
      res.json({ status: 'ok' })
    } catch (error) {
      res.status(500).json({
        status: 'error',
        error: 'Database unreachable',
      })
    }
  }
}
