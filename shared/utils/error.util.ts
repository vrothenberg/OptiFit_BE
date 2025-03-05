import { HttpException, HttpStatus } from '@nestjs/common';

export class AppError extends HttpException {
  constructor(message: string, statusCode: HttpStatus) {
    super(
      {
        status: statusCode,
        error: message,
      },
      statusCode,
    );
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad Request') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, HttpStatus.FORBIDDEN);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Not Found') {
    super(message, HttpStatus.NOT_FOUND);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict') {
    super(message, HttpStatus.CONFLICT);
  }
}

export class InternalServerError extends AppError {
  constructor(message = 'Internal Server Error') {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(message = 'Service Unavailable') {
    super(message, HttpStatus.SERVICE_UNAVAILABLE);
  }
}

export class TooManyRequestsError extends AppError {
  constructor(message = 'Too Many Requests') {
    super(message, HttpStatus.TOO_MANY_REQUESTS);
  }
}
