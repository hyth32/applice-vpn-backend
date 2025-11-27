import { Router } from 'express'
import { HealthController } from '../controllers/health.controller'

const router = Router()
const controller = new HealthController()

router.get('/health', controller.health.bind(controller))

export default router
