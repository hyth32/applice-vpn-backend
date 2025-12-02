import { Router } from 'express'
import { KeyController } from '../controllers/key.controller'
import { validate } from '../middlewares/validate'
import { createKeySchema } from '../requests/key.request'

const router = Router()
const controller = new KeyController()

router.get('/keys', controller.list.bind(controller))
router.get('/keys/:keyId', controller.showKey.bind(controller))
router.post('/keys/buy', validate(createKeySchema), controller.createKey.bind(controller))

export default router
