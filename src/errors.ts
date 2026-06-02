export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500
  ) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

// 4xx — client errors (the request was wrong)

export class BadRequestError extends AppError {
  constructor(m = 'Bad request') { super(m, 400) }
}

export class UnauthorizedError extends AppError {
  constructor(m = 'Unauthorized') { super(m, 401) }
}

export class ForbiddenError extends AppError {
  constructor(m = 'Forbidden') { super(m, 403) }
}

export class NotFoundError extends AppError {
  constructor(m = 'Not found') { super(m, 404) }
}

export class MethodNotAllowedError extends AppError {
  constructor(m = 'Method not allowed') { super(m, 405) }
}

export class ConflictError extends AppError {
  constructor(m = 'Conflict') { super(m, 409) }
}

export class UnprocessableEntityError extends AppError {
  constructor(m = 'Unprocessable entity') { super(m, 422) }
}

export class TooManyRequestsError extends AppError {
  constructor(m = 'Too many requests') { super(m, 429) }
}

// 5xx — server errors (something broke on our side)

export class InternalServerError extends AppError {
  constructor(m = 'Internal server error') { super(m, 500) }
}

export class NotImplementedError extends AppError {
  constructor(m = 'Not implemented') { super(m, 501) }
}

export class ServiceUnavailableError extends AppError {
  constructor(m = 'Service unavailable') { super(m, 503) }
}