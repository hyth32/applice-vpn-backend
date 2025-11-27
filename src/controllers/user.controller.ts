import { Request, Response } from 'express'
import { UserService } from '../services/user.service'
import { CreateUserDto } from '../requests/user.request'

const userService = new UserService()

export class UserController {
  async create(req: Request, res: Response) {
    const data = req.body as CreateUserDto

    try {
      const { user, created } = await userService.create(data)
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
