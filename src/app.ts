import express from 'express'
import dotenv from 'dotenv'
import routes from './routes'

dotenv.config()

export function createApp() {
  const app = express()

  app.use(express.json())
  app.use(routes)

  return app
}
