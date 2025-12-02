import { NextFunction } from 'express'
import { z } from 'zod'
import { KeyService } from '../services/key.service'
import { ValidatedRequest } from '../middlewares/validate'
import { createKeySchema, listKeysQuerySchema, showKeyParamsSchema, showKeyQuerySchema } from '../requests/key.request'
import { HttpError } from '../lib/errors/http-error'
import { UserRepository } from '../repositories/user.repository'
import { KeyRepository } from '../repositories/key.repository'

const userRepository = new UserRepository()
const keyRepository = new KeyRepository()
const keyService = new KeyService()

export class KeyController {
  private async checkAccess(telegramId: string, keyId: number): Promise<void> {
    const user = await userRepository.findByTelegramIdOrThrow(telegramId)
    const hasAccess = await keyRepository.existsByUserId(keyId, user.id)

    if (!hasAccess) {
      throw new HttpError('Access denied', 403)
    }
  }

  async list(req: ValidatedRequest<unknown, z.infer<typeof listKeysQuerySchema>>, _res: any, next: NextFunction) {
    try {
      const user = await userRepository.findByTelegramIdOrThrow(req.validated.query.telegramId)
      const keys = await keyRepository.listByUserId(user.id)
      next({ success: true, data: keys })
    } catch (error) {
      next(error)
    }
  }

  async createKey(req: ValidatedRequest<unknown, unknown, z.infer<typeof createKeySchema>>, _res: any, next: NextFunction) {
    try {
      const { key, created } = await keyService.create(req.validated.body)
      next({ success: true, data: key, statusCode: created ? 201 : 200 })
    } catch (error) {
      next(error)
    }
  }

  async showKey(
    req: ValidatedRequest<z.infer<typeof showKeyParamsSchema>, z.infer<typeof showKeyQuerySchema>>,
    _res: any,
    next: NextFunction,
  ) {
    try {
      const { telegramId } = req.validated.query
      const keyId = req.validated.params.keyId

      await this.checkAccess(telegramId, keyId)
      const key = await keyService.show(keyId)
      next({ success: true, data: key })
    } catch (error) {
      next(error)
    }
  }
}
