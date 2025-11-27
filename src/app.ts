import express from 'express'
import dotenv from 'dotenv'
import routes from './routes'
import { initZodErrorMap } from './lib/validation/zod-error-map'
import { errorHandler } from './middlewares/error-handler'

dotenv.config()
initZodErrorMap()

export function createApp() {
  const app = express()

  app.use(express.json())
  app.use(routes)
  app.use(errorHandler)

  return app
}
