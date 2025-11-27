import { NextFunction, Request, Response } from 'express'

type ResponsePayload =
  | {
      success: true
      data?: unknown
      statusCode?: number
    }
  | {
      success: false
      message?: string
      statusCode?: number
    }

export function responseHandler(payload: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (isResponsePayload(payload)) {
    const status = payload.statusCode ?? (payload.success ? 200 : 500)

    if (payload.success) {
      res.status(status).json({ success: true, data: payload.data ?? null })
      return
    }

    res.status(status).json({ success: false, message: payload.message || 'Internal Server Error' })
    return
  }

  const statusCode = typeof (payload as any)?.statusCode === 'number' ? (payload as any).statusCode : 500
  const message = (payload as any)?.message && typeof (payload as any).message === 'string' ? (payload as any).message : 'Internal Server Error'

  res.status(statusCode).json({ success: false, message })
}

function isResponsePayload(payload: unknown): payload is ResponsePayload {
  return typeof payload === 'object' && payload !== null && 'success' in payload
}
