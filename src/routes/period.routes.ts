import { Router } from 'express'
import { PeriodController } from '../controllers/period.controller'

const router = Router()
const controller = new PeriodController()

router.get('/periods', controller.list.bind(controller))

export default router
