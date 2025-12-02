import { Router, RequestHandler } from 'express'
import { PeriodController } from '../controllers/period.controller'
import { validate } from '../middlewares/validate'
import { listPeriodsQuerySchema } from '../requests/period.request'

const router = Router()
const controller = new PeriodController()

router.get(
  '/periods',
  validate(listPeriodsQuerySchema, 'query'),
  controller.list.bind(controller) as unknown as RequestHandler,
)

export default router
