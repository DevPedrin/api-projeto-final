export class AppError extends Error {
  constructor({
    message,
    publicMessage = 'Algo deu errado',
    status = 400,
    code = 'APP_ERROR'
  }) {
    super(message)

    this.name = 'AppError'
    this.status = status
    this.code = code
    this.publicMessage = publicMessage

    Error.captureStackTrace(this, this.constructor)
  }
}