import { Router } from 'express'
import { RegionController } from '../controllers/region.controller'

const router = Router()
const controller = new RegionController()

router.get('/regions', controller.list.bind(controller))

export default router
