import express, { Request, Response } from 'express'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'

dotenv.config()

const app = express()
const prisma = new PrismaClient()

app.use(express.json())

app.get('/health', async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.json({ status: 'ok' })
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: 'Database unreachable',
    })
  }
})

const port = process.env.PORT || 3000

async function start() {
  try {
    app.listen(port, () => {
      console.log(`Server listening on http://localhost:${port}`)
    })
  } catch (error) {
    console.error('Failed to start server', error)
    process.exit(1)
  }
}

start()
