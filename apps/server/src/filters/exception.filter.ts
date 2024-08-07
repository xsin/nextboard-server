import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import type { Response } from 'express'
import { ApiResponseX } from 'src/common/dto'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    // const request = ctx.getRequest<Request>()
    const status
      = exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR

    const message
      = exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error'

    const errorResponse = new ApiResponseX()
    errorResponse.code = status
    errorResponse.data = null
    errorResponse.success = false
    errorResponse.message
      = typeof message === 'string' ? message : (message as any).message

    response.status(status).json(errorResponse)
  }
}
