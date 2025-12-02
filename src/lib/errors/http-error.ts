export class HttpError extends Error {
  statusCode: number

  constructor(message: string, statusCode = 500) {
    super(message || 'Internal Server Error')
    this.statusCode = statusCode
  }
}
