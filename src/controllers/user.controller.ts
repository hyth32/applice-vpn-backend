import { Response } from 'express'
import { UserService } from '../services/user.service'
import { createUserSchema } from '../requests/user.request'
import { ValidatedRequest } from '../middlewares/validate'

const userService = new UserService()

export class UserController {
  async create(req: ValidatedRequest<typeof createUserSchema>, res: Response) {
    try {
      const { user, created } = await userService.create(req.body)
      const statusCode = created ? 201 : 200

      res.status(statusCode).json(user)
    } catch (error) {
      if (error instanceof Error && error.message === 'telegramId is required') {
        res.status(400).json({ error: error.message })
        return
      }

      res.status(500).json({ error: 'Failed to create user' })
    }
  }
}
