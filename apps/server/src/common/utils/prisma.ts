import { Prisma } from '@prisma/client'
import { isEmpty } from 'radash'
import type { IListQueryDto } from 'src/common/dto'

/**
 * Builds the parameters for the Prisma `findMany` method based on the provided DTO.
 *
 * @template T - The type of the entity.
 * @param {IListQueryDto} dto - The data transfer object containing query parameters.
 * @returns {Prisma.UserFindManyArgs} The parameters for the Prisma `findMany` method.
 */
export function buildFindManyParams<T>(dto: IListQueryDto): Prisma.UserFindManyArgs {
  const {
    page = 1,
    limit = 20,
    orders = [],
    search,
    filters = [],
  } = dto
  const skip = (page - 1) * limit

  const where: Prisma.UserWhereInput = {}
  const splitter = '^'

  // Handle search functionality
  if (!isEmpty(search)) {
    const [term, fields] = search.split(splitter)
    const searchFields = fields ? fields.split(',') : ['name', 'displayName', 'remark']
    where.OR = searchFields.map(field => ({
      [field]: { contains: term },
    }))
  }

  // Handle filters functionality
  if (!isEmpty(filters)) {
    filters.forEach((filter) => {
      const [field, operator, value] = filter.split(splitter)
      if (field && operator && value) {
        const fieldType = field as keyof T
        switch (operator) {
          case 'equals':
            where[field] = { equals: value }
            break
          case 'lt':
          case 'gt':
          case 'lte':
          case 'gte':
            if (typeof fieldType === 'number' || fieldType instanceof Date) {
              where[field] = { [operator]: value }
            }
            break
          case 'contains':
            where[field] = { contains: value }
            break
          case 'startsWith':
            where[field] = { startsWith: value }
            break
          case 'endsWith':
            where[field] = { endsWith: value }
            break
          case 'in':
            where[field] = { in: value.split(',') }
            break
          case 'notIn':
            where[field] = { notIn: value.split(',') }
            break
          default:
            console.warn(`Unsupported operator: ${operator}`)
            break
        }
      }
    })
  }

  // Handle ordering functionality
  const orderBy = orders?.map((order) => {
    const [field, direction] = order.split(splitter)
    return { [field]: direction }
  }) || []

  return {
    where,
    take: limit,
    skip,
    orderBy,
  }
}
