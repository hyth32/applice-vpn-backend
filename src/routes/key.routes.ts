import { Router, RequestHandler } from 'express'
import { KeyController } from '../controllers/key.controller'
import { validate } from '../middlewares/validate'
import { createKeySchema, listKeysQuerySchema, showKeyParamsSchema, showKeyQuerySchema } from '../requests/key.request'

const router = Router()
const controller = new KeyController()

router.get('/keys', validate(listKeysQuerySchema, 'query'), controller.list.bind(controller) as unknown as RequestHandler)
router.get(
  '/keys/:keyId',
  validate(showKeyParamsSchema, 'params'),
  validate(showKeyQuerySchema, 'query'),
  controller.showKey.bind(controller) as unknown as RequestHandler
)
router.post('/keys/buy', validate(createKeySchema), controller.createKey.bind(controller) as unknown as RequestHandler)
router.get(
  '/keys/:keyId/config',
  validate(showKeyParamsSchema, 'params'),
  validate(listKeysQuerySchema, 'query'),
  controller.getConfig.bind(controller) as unknown as RequestHandler
)
router.delete(
  '/keys/:keyId',
  validate(showKeyParamsSchema, 'params'),
  validate(listKeysQuerySchema, 'query'),
  controller.deleteKey.bind(controller) as unknown as RequestHandler
)

export default router
