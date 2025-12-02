import { NextFunction } from 'express'
import { z } from 'zod'
import { UserService } from '../services/user.service'
import { createUserSchema } from '../requests/user.request'
import { ValidatedRequest } from '../middlewares/validate'

const userService = new UserService()

export class UserController {
  async create(req: ValidatedRequest<z.ZodTypeAny, z.ZodTypeAny, typeof createUserSchema>, _res: any, next: NextFunction) {
    try {
      const { user, created } = await userService.create(req.validated.body)
      next({ success: true, data: user, statusCode: created ? 201 : 200 })
    } catch (error) {
      next(error)
    }
  }
}
