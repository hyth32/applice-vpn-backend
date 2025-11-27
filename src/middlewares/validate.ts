import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'

export type ValidatedRequest<T extends z.ZodTypeAny> = Request<unknown, unknown, z.infer<T>>

export const validate =
  <T extends z.ZodTypeAny>(schema: T) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
      const messages = result.error.issues.map((err) => err.message)
      res.status(400).json({ error: messages.join(', ') })
      return
    }

    ;(req as ValidatedRequest<T>).body = result.data
    next()
  }
