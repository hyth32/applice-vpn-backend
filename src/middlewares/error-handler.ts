import { NextFunction, Request, Response } from 'express'

type KnownError = {
  statusCode?: number
  message?: string
}

export function errorHandler(err: KnownError, _req: Request, res: Response, _next: NextFunction) {
  const statusCode = err.statusCode && err.statusCode >= 400 ? err.statusCode : 500
  const message = err.message || 'Internal Server Error'

  res.status(statusCode).json({ error: message })
}
