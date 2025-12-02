import { Router, RequestHandler } from 'express'
import { PriceController } from '../controllers/price.controller'
import { validate } from '../middlewares/validate'
import { listPricesQuerySchema } from '../requests/price.request'

const router = Router()
const controller = new PriceController()

router.get(
  '/prices',
  validate(listPricesQuerySchema, 'query'),
  controller.list.bind(controller) as unknown as RequestHandler,
)

export default router
