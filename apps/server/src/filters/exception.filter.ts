import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common'
import type { Request, Response } from 'express'
import { ApiResponse } from 'src/common/dto'
import { LogService } from 'src/modules/log/log.service'

@Injectable()
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logService: LogService) {}

  private readonly logger = new Logger(HttpExceptionFilter.name)

  async catch(exception: unknown, host: ArgumentsHost): Promise<void> {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const status
      = exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR

    const message
      = exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error'

    const errorResponse = new ApiResponse()
    errorResponse.code = status
    errorResponse.data = null
    errorResponse.success = false
    errorResponse.message
      = typeof message === 'string' ? message : (message as any).message

    this.logger.error(`HTTP Status: ${status}\r\nError Message: ${JSON.stringify(message)}`)

    // Log the error
    const ip = request.headers['x-forwarded-for'][0] ?? request.ip
    try {
      await this.logService.create({
        userId: request.user?.id,
        userEmail: request.user?.email,
        userAgent: request.headers['user-agent'],
        ip,
        level: 'error',
        isSystem: true,
        operation: HttpExceptionFilter.name,
        meta: {
          message,
        },
      })
    }
    catch (e) {
      this.logger.error(`Failed to log error: ${e.message}`)
    }

    response.status(status).json(errorResponse)
  }
}
