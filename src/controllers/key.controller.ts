import { NextFunction, Request } from 'express'
import { KeyService } from '../services/key.service'
import { ValidatedRequest } from '../middlewares/validate'
import { createKeySchema } from '../requests/key.request'
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

  async list(req: Request, _res: any, next: NextFunction) {
    try {
      const telegramId = typeof req.query.telegramId === 'string' ? req.query.telegramId : null
      if (!telegramId) {
        throw new HttpError('telegramId is required', 400)
      }
      const user = await userRepository.findByTelegramIdOrThrow(telegramId)
      const keys = await keyRepository.listByUserId(user.id)
      next({ success: true, data: keys })
    } catch (error) {
      next(error)
    }
  }

  async createKey(req: ValidatedRequest<typeof createKeySchema>, _res: any, next: NextFunction) {
    try {
      const { key, created } = await keyService.create(req.body)
      next({ success: true, data: key, statusCode: created ? 201 : 200 })
    } catch (error) {
      next(error)
    }
  }

  async showKey(req: Request, _res: any, next: NextFunction) {
    try {
      const telegramId = typeof req.query.telegramId === 'string' ? req.query.telegramId : null
      const keyId = Number(req.params.keyId)

      if (!telegramId) {
        throw new HttpError('telegramId is required', 400)
      }
      if (!Number.isFinite(keyId)) {
        throw new HttpError('keyId is required', 400)
      }

      await this.checkAccess(telegramId, keyId)
      const key = await keyRepository.findByIdOrThrow(keyId)

      next({ success: true, data: key })
    } catch (error) {
      next(error)
    }
  }
}
