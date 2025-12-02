import { NextFunction } from 'express'
import { RegionService } from '../services/region.service'

const regionService = new RegionService()

export class RegionController {
  async list(_req: any, _res: any, next: NextFunction) {
    try {
      const regions = await regionService.list()
      next({ success: true, data: regions })
    } catch (error) {
      next(error)
    }
  }
}
