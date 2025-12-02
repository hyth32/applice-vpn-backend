import { Router } from 'express'
import healthRoutes from './health.routes'
import userRoutes from './user.routes'
import keyRoutes from './key.routes'

const router = Router()

router.use(healthRoutes)
router.use(userRoutes)
router.use(keyRoutes)

export default router
