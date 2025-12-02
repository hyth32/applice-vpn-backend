import { Router } from 'express'
import healthRoutes from './health.routes'
import userRoutes from './user.routes'
import keyRoutes from './key.routes'
import regionRoutes from './region.routes'

const router = Router()

router.use(healthRoutes)
router.use(userRoutes)
router.use(keyRoutes)
router.use(regionRoutes)

export default router
