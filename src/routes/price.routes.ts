import { Router } from 'express'
import { PriceController } from '../controllers/price.controller'

const router = Router()
const controller = new PriceController()

router.get('/prices', controller.list.bind(controller))

export default router
