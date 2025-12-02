import { Router, RequestHandler } from 'express'
import { UserController } from '../controllers/user.controller'
import { validate } from '../middlewares/validate'
import { createUserSchema } from '../requests/user.request'

const router = Router()
const controller = new UserController()

router.post('/users', validate(createUserSchema), controller.create.bind(controller) as unknown as RequestHandler)

export default router
