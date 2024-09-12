import { CallHandler, ExecutionContext } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { lastValueFrom, of } from 'rxjs'
import { ApiResponse } from 'src/common/dto'
import { beforeEach, describe, expect, it } from 'vitest'
import { ResponseFormatInterceptor } from './response.interceptor'

describe('responseFormatInterceptor', () => {
  let interceptor: ResponseFormatInterceptor<any>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResponseFormatInterceptor],
    }).compile()

    interceptor = module.get<ResponseFormatInterceptor<any>>(ResponseFormatInterceptor)
  })

  it('should be defined', () => {
    expect(interceptor).toBeDefined()
  })

  it('should transform the response', async () => {
    const mockData = { foo: 'bar' }
    const mockContext = {} as ExecutionContext
    const mockNext: CallHandler = {
      handle: () => of(mockData),
    }

    const result = await lastValueFrom(interceptor.intercept(mockContext, mockNext))

    expect(result).toBeInstanceOf(ApiResponse)
    expect(result.code).toBe(200)
    expect(result.data).toEqual(mockData)
    expect(result.success).toBe(true)
    expect(result.message).toBe('Success')
  })

  it('should handle null data', async () => {
    const mockContext = {} as ExecutionContext
    const mockNext: CallHandler = {
      handle: () => of(null),
    }

    const result = await lastValueFrom(interceptor.intercept(mockContext, mockNext))

    expect(result).toBeInstanceOf(ApiResponse)
    expect(result.code).toBe(200)
    expect(result.data).toBeNull()
    expect(result.success).toBe(true)
    expect(result.message).toBe('Success')
  })

  it('should handle undefined data', async () => {
    const mockContext = {} as ExecutionContext
    const mockNext: CallHandler = {
      handle: () => of(undefined),
    }

    const result = await lastValueFrom(interceptor.intercept(mockContext, mockNext))

    expect(result).toBeInstanceOf(ApiResponse)
    expect(result.code).toBe(200)
    expect(result.data).toBeUndefined()
    expect(result.success).toBe(true)
    expect(result.message).toBe('Success')
  })

  it('should handle complex data structures', async () => {
    const mockData = {
      users: [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
      ],
      metadata: {
        total: 2,
        page: 1,
      },
    }
    const mockContext = {} as ExecutionContext
    const mockNext: CallHandler = {
      handle: () => of(mockData),
    }

    const result = await lastValueFrom(interceptor.intercept(mockContext, mockNext))

    expect(result).toBeInstanceOf(ApiResponse)
    expect(result.code).toBe(200)
    expect(result.data).toEqual(mockData)
    expect(result.success).toBe(true)
    expect(result.message).toBe('Success')
  })
})
