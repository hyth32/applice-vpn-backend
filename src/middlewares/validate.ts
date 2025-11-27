import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'

type AnySchema = z.ZodType

export const validate = (schema: AnySchema) => (req: Request, res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.body)

  if (!result.success) {
    const messages = result.error.issues.map((err) => err.message)
    res.status(400).json({ error: messages.join(', ') })
    return
  }

  req.body = result.data
  next()
}
