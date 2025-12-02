import { NextFunction, Request, response } from 'express'
import { KeyService } from '../services/key.service'
import { ValidatedRequest } from '../middlewares/validate'
import { createKeySchema } from '../requests/key.request'

const keyService = new KeyService()

export class KeyController {
  async createKey(req: ValidatedRequest<typeof createKeySchema>, _res: any, next: NextFunction) {
    try {
      const { key, created } = await keyService.create(req.body)
      next({ success: true, data: key, statusCode: created ? 201 : 200 })
    } catch (error) {
      next(error)
    }
  }
}
