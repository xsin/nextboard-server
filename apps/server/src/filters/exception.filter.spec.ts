import { HttpException, HttpStatus, Logger } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { ApiResponse } from 'src/common/dto'
import { LogService } from 'src/modules/log/log.service'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { HttpExceptionFilter } from './exception.filter'

describe('httpExceptionFilter', () => {
  let filter: HttpExceptionFilter
  let logService: LogService
  let loggerSpy: any

  const mockLogService = {
    create: vi.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HttpExceptionFilter,
        { provide: LogService, useValue: mockLogService },
      ],
    }).compile()

    filter = module.get<HttpExceptionFilter>(HttpExceptionFilter)
    logService = module.get<LogService>(LogService)
    loggerSpy = vi.spyOn(Logger.prototype, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('getIp', () => {
    it('should return IP from x-forwarded-for header', () => {
      const request = {
        headers: { 'x-forwarded-for': '192.168.1.1, 10.0.0.1' },
      } as any
      expect(filter.getIp(request)).toBe('192.168.1.1')
    })

    it('should return IP from socket if x-forwarded-for is not present', () => {
      const request = {
        headers: {},
        socket: { remoteAddress: '127.0.0.1' },
      } as any
      expect(filter.getIp(request)).toBe('127.0.0.1')
    })

    it('should return IP from request.ip if socket.remoteAddress is not present', () => {
      const request = {
        headers: {},
        socket: {},
        ip: '192.168.0.1',
      } as any
      expect(filter.getIp(request)).toBe('192.168.0.1')
    })

    it('should return empty string if no IP is found', () => {
      const request = { headers: {}, socket: {} } as any
      expect(filter.getIp(request)).toBe('')
    })

    it('should handle IPv6 addresses that are actually IPv4', () => {
      const request = {
        headers: {},
        socket: { remoteAddress: '::ffff:127.0.0.1' },
      } as any
      expect(filter.getIp(request)).toBe('127.0.0.1')
    })
  })

  describe('removePasswordFields', () => {
    it('should remove fields that start with "password"', () => {
      const body = {
        username: 'test-user',
        password: 'secret',
        passwordConfirm: 'secret',
        otherField: 'value',
      }
      const sanitizedBody = filter.removePasswordFields(body)
      expect(sanitizedBody).toEqual({
        username: 'test-user',
        otherField: 'value',
      })
    })

    it('should not modify body if no fields start with "password"', () => {
      const body = {
        username: 'test-user',
        otherField: 'value',
      }
      const sanitizedBody = filter.removePasswordFields(body)
      expect(sanitizedBody).toEqual(body)
    })

    it('should handle non-object body', () => {
      expect(filter.removePasswordFields(null)).toBeNull()
      expect(filter.removePasswordFields('string')).toBe('string')
      expect(filter.removePasswordFields(123)).toBe(123)
    })
  })

  describe('normalizeError', () => {
    it('should normalize HttpException with string message', () => {
      const exception = new HttpException('Test error', HttpStatus.BAD_REQUEST)
      const normalizedError = filter.normalizeError(exception)
      expect(normalizedError.message).toBe('Test error')
      expect(normalizedError.name).toBe(exception.name)
      expect(normalizedError.stack).toBe(exception.stack)
    })

    it('should normalize HttpException with object message', () => {
      const exception = new HttpException({ message: 'Custom error object' }, HttpStatus.BAD_REQUEST)
      const normalizedError = filter.normalizeError(exception)
      expect(normalizedError.message).toBe('Custom error object')
      expect(normalizedError.name).toBe(exception.name)
      expect(normalizedError.stack).toBe(exception.stack)
    })

    it('should normalize HttpException with array message', () => {
      const exception = new HttpException({ message: ['Error 1', 'Error 2'] }, HttpStatus.BAD_REQUEST)
      const normalizedError = filter.normalizeError(exception)
      expect(normalizedError.message).toBe('Error 1\nError 2')
      expect(normalizedError.name).toBe(exception.name)
      expect(normalizedError.stack).toBe(exception.stack)
    })

    it('should normalize generic Error', () => {
      const exception = new Error('Generic error')
      const normalizedError = filter.normalizeError(exception)
      expect(normalizedError.message).toBe('Generic error')
      expect(normalizedError.name).toBe(exception.name)
      expect(normalizedError.stack).toBe(exception.stack)
    })

    it('should normalize unknown exception', () => {
      const exception = { unknown: 'error' }
      const normalizedError = filter.normalizeError(exception)
      expect(normalizedError.message).toBe('Unknown error')
      expect(normalizedError.name).toBe('UnknownError')
      expect(normalizedError.stack).toContain('Unknown error')
    })
  })

  describe('catch', () => {
    const mockJson = vi.fn()
    const mockStatus = vi.fn().mockReturnValue({ json: mockJson })
    const mockGetResponse = vi.fn().mockReturnValue({ status: mockStatus })
    const mockGetRequest = vi.fn().mockReturnValue({
      headers: { 'user-agent': 'test-agent' },
      user: { id: '1', email: 'test@example.com' },
      socket: { remoteAddress: '127.0.0.1' },
      ip: '127.0.0.1',
      body: {
        username: 'test-user',
        password: 'secret',
        passwordConfirm: 'secret',
      },
    })
    const mockHttpArgumentsHost = {
      getResponse: mockGetResponse,
      getRequest: mockGetRequest,
    }
    const mockArgumentsHost = {
      switchToHttp: () => mockHttpArgumentsHost,
    }

    it('should handle HttpException with string message', async () => {
      const exception = new HttpException('Test error', HttpStatus.BAD_REQUEST)
      await filter.catch(exception, mockArgumentsHost as any)

      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST)
      expect(mockJson).toHaveBeenCalledWith(expect.any(ApiResponse))
      expect(logService.create).toHaveBeenCalledWith(expect.objectContaining({
        userId: '1',
        userEmail: 'test@example.com',
        userAgent: 'test-agent',
        ip: '127.0.0.1',
        level: 'error',
        isSystem: true,
        operation: HttpExceptionFilter.name,
        meta: expect.objectContaining({
          request: expect.objectContaining({
            body: {
              username: 'test-user',
            },
          }),
        }),
      }))
      expect(loggerSpy).toHaveBeenCalled()
    })

    it('should handle HttpException with object message', async () => {
      const exception = new HttpException({ message: 'Custom error object' }, HttpStatus.BAD_REQUEST)
      await filter.catch(exception, mockArgumentsHost as any)

      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST)
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          code: HttpStatus.BAD_REQUEST,
          success: false,
          data: null,
          message: 'Custom error object',
        }),
      )
      expect(logService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: '1',
          userEmail: 'test@example.com',
          userAgent: 'test-agent',
          ip: '127.0.0.1',
          level: 'error',
          isSystem: true,
          operation: HttpExceptionFilter.name,
          meta: expect.objectContaining({
            request: expect.objectContaining({
              body: {
                username: 'test-user',
              },
            }),
          }),
        }),
      )
      expect(loggerSpy).toHaveBeenCalled()
    })

    it('should handle HttpException with array message', async () => {
      const exception = new HttpException({ message: ['Error 1', 'Error 2'] }, HttpStatus.BAD_REQUEST)
      await filter.catch(exception, mockArgumentsHost as any)

      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST)
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          code: HttpStatus.BAD_REQUEST,
          success: false,
          data: null,
          message: 'Error 1\nError 2',
        }),
      )
      expect(logService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: '1',
          userEmail: 'test@example.com',
          userAgent: 'test-agent',
          ip: '127.0.0.1',
          level: 'error',
          isSystem: true,
          operation: HttpExceptionFilter.name,
          meta: expect.objectContaining({
            request: expect.objectContaining({
              body: {
                username: 'test-user',
              },
            }),
          }),
        }),
      )
      expect(loggerSpy).toHaveBeenCalled()
    })

    it('should handle unknown exceptions', async () => {
      const exception = new Error('Unknown error')
      await filter.catch(exception, mockArgumentsHost as any)

      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR)
      expect(mockJson).toHaveBeenCalledWith(expect.any(ApiResponse))
      expect(logService.create).toHaveBeenCalled()
      expect(loggerSpy).toHaveBeenCalled()
    })

    it('should handle errors when logging fails', async () => {
      const exception = new HttpException('Test error', HttpStatus.BAD_REQUEST)
      mockLogService.create.mockRejectedValue(new Error('Logging failed'))

      await filter.catch(exception, mockArgumentsHost as any)

      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST)
      expect(mockJson).toHaveBeenCalledWith(expect.any(ApiResponse))
      expect(logService.create).toHaveBeenCalled()
      expect(loggerSpy).toHaveBeenCalledTimes(2) // Once for the main error, once for the logging error
    })

    it('should handle HttpException with non-string message', async () => {
      const exception = new HttpException({ message: 'Custom error object' }, HttpStatus.BAD_REQUEST)
      await filter.catch(exception, mockArgumentsHost as any)

      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST)
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          code: HttpStatus.BAD_REQUEST,
          success: false,
          data: null,
          message: 'Custom error object',
        }),
      )
      expect(logService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: '1',
          userEmail: 'test@example.com',
          userAgent: 'test-agent',
          ip: '127.0.0.1',
          level: 'error',
          isSystem: true,
          operation: HttpExceptionFilter.name,
          meta: expect.objectContaining({
            request: expect.objectContaining({
              body: {
                username: 'test-user',
              },
            }),
          }),
        }),
      )
      expect(loggerSpy).toHaveBeenCalled()
    })
  })
})
