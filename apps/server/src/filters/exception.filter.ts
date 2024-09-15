import type { Request, Response } from 'express'
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common'
import { ApiResponse } from 'src/common/dto'
import { LogService } from 'src/modules/log/log.service'

@Injectable()
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logService: LogService) {}

  private readonly logger = new Logger(HttpExceptionFilter.name)

  getIp(request: Request): string {
    const xForwardedFor = request.headers['x-forwarded-for']
    if (xForwardedFor) {
      const ips = (xForwardedFor as string).split(',')
      return ips[0].trim()
    }

    const ip = request.ip || request.socket.remoteAddress || ''

    // Handle IPv6 addresses that are actually IPv4
    if (ip.startsWith('::ffff:')) {
      return ip.substring(7)
    }

    return ip
  }

  normalizeError(exception: unknown): Error {
    let messageText: string
    const normalizedError: Error = new Error('Unknown error')

    if (exception instanceof HttpException) {
      const message = exception.getResponse()
      if (typeof message === 'string') {
        messageText = message
      }
      else {
        const messageObj = message as any
        if (Array.isArray(messageObj.message)) {
          messageText = messageObj.message.join('\n')
        }
        else {
          messageText = messageObj.message
        }
      }
      normalizedError.name = exception.name
      normalizedError.stack = exception.stack
    }
    else if (exception instanceof Error) {
      messageText = exception.message
      normalizedError.name = exception.name
      normalizedError.stack = exception.stack
    }
    else {
      messageText = 'Unknown error'
      normalizedError.name = 'UnknownError'
    }
    normalizedError.message = messageText

    return normalizedError
  }

  removePasswordFields(body: any): any {
    if (typeof body !== 'object' || body === null) {
      return body
    }

    const sanitizedBody = { ...body }
    for (const key of Object.keys(sanitizedBody)) {
      if (key.toLowerCase().startsWith('password')) {
        delete sanitizedBody[key]
      }
    }
    return sanitizedBody
  }

  async catch(exception: unknown, host: ArgumentsHost): Promise<void> {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const status
      = exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR

    const normalizedError = this.normalizeError(exception)

    const errorResponse = new ApiResponse()
    errorResponse.code = status
    errorResponse.data = null
    errorResponse.success = false
    errorResponse.message = normalizedError.message

    this.logger.error(`HTTP Status: ${status}\r\nError Message: ${normalizedError.message}`)

    // Log the error
    const ip = this.getIp(request)
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
          error: {
            status,
            name: normalizedError.name,
            message: normalizedError.message,
            stack: normalizedError.stack,
          },
          request: {
            method: request.method,
            url: request.url,
            headers: request.headers,
            body: this.removePasswordFields(request.body),
            query: request.query,
          },
        },
      })
    }
    catch (e) {
      this.logger.error(`Failed to log error: ${e.message}`)
    }

    response.status(status).json(errorResponse)
  }
}
