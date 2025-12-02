import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'
import { HttpError } from '../lib/errors/http-error'

type Location = 'body' | 'query' | 'params'

export type ValidatedRequest<P = any, Q = any, B = any> = Request & {
  validated: {
    params: P
    query: Q
    body: B
  }
}

export const validate =
  <T extends z.ZodTypeAny, L extends Location = 'body'>(schema: T, location: L = 'body' as L) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const data = (req as any)[location]
    const result = schema.safeParse(data)

    if (!result.success) {
      const messages = result.error.issues.map((err) => err.message)
      return next(new HttpError(messages.join(', '), 400))
    }

    const current = (req as any)[location]
    if (current && typeof current === 'object') {
      Object.assign(current, result.data)
    }

    const validated = ((req as any).validated ||= { params: {}, query: {}, body: {} })
    validated[location] = result.data

    return next()
  }
