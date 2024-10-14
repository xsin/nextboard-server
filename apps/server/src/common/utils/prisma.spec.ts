import type { IListQueryDto, User } from '@xsin/xboard'
import { Prisma } from '@xsin/xboard'
import { describe, expect, it } from 'vitest'
import { buildFindManyParams } from './prisma'

describe('buildFindManyParams', () => {
  it('should return default parameters when no DTO is provided', () => {
    const result = buildFindManyParams<Prisma.UserFindManyArgs>({})
    expect(result).toEqual({
      where: {},
      take: 20,
      skip: 0,
      orderBy: [],
    })
  })

  it('should handle pagination correctly', () => {
    const dto: IListQueryDto = { page: 2, limit: 10 }
    const result = buildFindManyParams<Prisma.UserFindManyArgs>(dto)
    expect(result).toEqual({
      where: {},
      take: 10,
      skip: 10,
      orderBy: [],
    })
  })

  it('should handle search functionality with default fields', () => {
    const dto: IListQueryDto = { search: 'test' }
    const result = buildFindManyParams<Prisma.UserFindManyArgs>(dto)
    expect(result.where).toEqual({
      OR: [
        { name: { contains: 'test' } },
        { displayName: { contains: 'test' } },
        { remark: { contains: 'test' } },
      ],
    })
  })

  it('should handle search functionality with custom fields', () => {
    const dto: IListQueryDto = { search: 'test^email,username' }
    const result = buildFindManyParams<Prisma.UserFindManyArgs>(dto)
    expect(result.where).toEqual({
      OR: [
        { email: { contains: 'test' } },
        { username: { contains: 'test' } },
      ],
    })
  })

  it('should handle filters correctly', () => {
    const dto: IListQueryDto = {
      filters: [
        'age^gte^18',
        'name^contains^John',
        'status^in^active,pending',
      ],
    }
    const result = buildFindManyParams<Prisma.UserFindManyArgs>(dto)
    expect(result.where).toEqual({
      age: { gte: '18' },
      name: { contains: 'John' },
      status: { in: ['active', 'pending'] },
    })
  })

  it('should handle ordering correctly', () => {
    const dto: IListQueryDto = {
      orders: ['name^asc', 'createdAt^desc'],
    }
    const result = buildFindManyParams<Prisma.UserFindManyArgs>(dto)
    expect(result.orderBy).toEqual([
      { name: 'asc' },
      { createdAt: 'desc' },
    ])
  })

  it('should handle complex query with search, filters, and ordering', () => {
    const dto: IListQueryDto = {
      page: 2,
      limit: 15,
      search: 'John^name,email',
      filters: ['age^gte^18'],
      orders: ['createdAt^desc'],
    }
    const result = buildFindManyParams<Prisma.UserFindManyArgs>(dto)
    expect(result).toEqual({
      where: {
        OR: [
          { name: { contains: 'John' } },
          { email: { contains: 'John' } },
        ],
        age: { gte: '18' },
      },
      take: 15,
      skip: 15,
      orderBy: [{ createdAt: 'desc' }],
    })
  })

  it('should throw an error for unsupported filter operators', () => {
    const dto: IListQueryDto = {
      filters: ['field^unsupported^value'],
    }
    expect(() => buildFindManyParams<Prisma.UserFindManyArgs>(dto)).toThrow('Unsupported operator: unsupported')
  })

  it('should handle empty search and filters', () => {
    const dto: IListQueryDto = {
      search: '',
      filters: [],
    }
    const result = buildFindManyParams<Prisma.UserFindManyArgs>(dto)
    expect(result.where).toEqual({})
  })

  it('should use custom default search fields when provided', () => {
    const dto: IListQueryDto = { search: 'test' }
    const customFields = ['name', 'displayName'] as (keyof User)[]
    const result = buildFindManyParams<Prisma.UserFindManyArgs>(dto, customFields)
    expect(result.where).toEqual({
      OR: [
        { name: { contains: 'test' } },
        { displayName: { contains: 'test' } },
      ],
    })
  })

  it('should handle multiple filters with different operators', () => {
    const dto: IListQueryDto = {
      filters: ['age^gte^18', 'status^equals^active', 'lastLogin^lt^2023-01-01'],
    }
    const result = buildFindManyParams<Prisma.UserFindManyArgs>(dto)
    expect(result.where).toEqual({
      age: { gte: '18' },
      status: { equals: 'active' },
      lastLogin: { lt: '2023-01-01' },
    })
  })

  it('should handle "in" and "notIn" operators correctly', () => {
    const dto: IListQueryDto = {
      filters: ['role^in^admin,user', 'status^notIn^banned,suspended'],
    }
    const result = buildFindManyParams<Prisma.UserFindManyArgs>(dto)
    expect(result.where).toEqual({
      role: { in: ['admin', 'user'] },
      status: { notIn: ['banned', 'suspended'] },
    })
  })

  it('should ignore invalid filter formats', () => {
    const dto: IListQueryDto = {
      filters: ['invalidFilter', 'age^gte^18', 'status^equals'],
    }
    const result = buildFindManyParams<Prisma.UserFindManyArgs>(dto)
    expect(result.where).toEqual({
      age: { gte: '18' },
    })
  })

  it('should handle empty orders array', () => {
    const dto: IListQueryDto = {
      orders: [],
    }
    const result = buildFindManyParams<Prisma.UserFindManyArgs>(dto)
    expect(result.orderBy).toEqual([])
  })

  it('should filter out invalid order directions', () => {
    const dto: IListQueryDto = {
      orders: ['name^asc', 'createdAt^invalid', 'updatedAt^desc'],
    }
    const result = buildFindManyParams<Prisma.UserFindManyArgs>(dto)
    expect(result.orderBy).toEqual([
      { name: 'asc' },
      { updatedAt: 'desc' },
    ])
  })

  it('should use provided default search fields', () => {
    const dto: IListQueryDto = { search: 'test' }
    const customFields = ['email', 'username']
    const result = buildFindManyParams<Prisma.UserFindManyArgs>(dto, customFields)
    expect(result.where).toEqual({
      OR: [
        { email: { contains: 'test' } },
        { username: { contains: 'test' } },
      ],
    })
  })

  it('should handle all supported filter operators', () => {
    const dto: IListQueryDto = {
      filters: [
        'field1^equals^value1',
        'field2^lt^10',
        'field3^gt^20',
        'field4^lte^30',
        'field5^gte^40',
        'field6^contains^partial',
        'field7^startsWith^start',
        'field8^endsWith^end',
      ],
    }
    const result = buildFindManyParams<Prisma.UserFindManyArgs>(dto)
    expect(result.where).toEqual({
      field1: { equals: 'value1' },
      field2: { lt: '10' },
      field3: { gt: '20' },
      field4: { lte: '30' },
      field5: { gte: '40' },
      field6: { contains: 'partial' },
      field7: { startsWith: 'start' },
      field8: { endsWith: 'end' },
    })
  })

  it('should handle combination of search, filters, and orders', () => {
    const dto: IListQueryDto = {
      search: 'John^name,email',
      filters: ['age^gte^18', 'status^equals^active'],
      orders: ['createdAt^desc', 'name^asc'],
    }
    const result = buildFindManyParams<Prisma.UserFindManyArgs>(dto)
    expect(result).toEqual({
      where: {
        OR: [
          { name: { contains: 'John' } },
          { email: { contains: 'John' } },
        ],
        age: { gte: '18' },
        status: { equals: 'active' },
      },
      take: 20,
      skip: 0,
      orderBy: [
        { createdAt: 'desc' },
        { name: 'asc' },
      ],
    })
  })
})
