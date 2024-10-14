import type { IListQueryDto } from '@xsin/xboard'
import { isEmpty } from 'radash'

/**
 * Builds the parameters for a Prisma findMany query based on the provided DTO.
 *
 * @template T - The type of the Prisma FindManyArgs being queried.
 * @param {IListQueryDto} dto - The Data Transfer Object containing query parameters.
 * @param {string[]} [defaultSearchFields] - Default fields to search if not specified in the DTO.
 * @returns {T} An object containing the constructed query parameters.
 *
 * @description
 * This function processes the following query parameters:
 * - Pagination: 'page' and 'limit'
 * - Searching: 'search' (with optional field specification)
 * - Filtering: 'filters' (using various operators)
 * - Ordering: 'orders'
 *
 * It constructs a query object compatible with Prisma's findMany method,
 * including 'where', 'take', 'skip', and 'orderBy' clauses.
 *
 * @example
 * const queryParams = buildFindManyParams<Prisma.UserFindManyArgs>({
 *   page: 2,
 *   limit: 10,
 *   search: 'John^name,email',
 *   filters: ['age^gte^18', 'status^equals^active'],
 *   orders: ['createdAt^desc']
 * });
 * const users = await prisma.user.findMany(queryParams);
 */
export function buildFindManyParams<T>(
  dto: IListQueryDto,
  defaultSearchFields: string[] = ['name', 'displayName', 'remark'],
): T {
  const {
    page = 1,
    limit = 20,
    orders = [],
    search,
    filters = [],
  } = dto
  const skip = (page - 1) * limit

  const where: Record<string, unknown> = {}
  const splitter = '^'

  // Handle search functionality
  if (!isEmpty(search)) {
    const [term, fields] = search.split(splitter)
    const searchFields = fields ? fields.split(',') : defaultSearchFields
    where.OR = searchFields.map(field => ({
      [field]: { contains: term },
    }))
  }

  // Handle filters functionality
  if (!isEmpty(filters)) {
    filters.forEach((filter) => {
      const [field, operator, value] = filter.split(splitter)
      if (field && operator && value) {
        switch (operator) {
          case 'equals':
          case 'lt':
          case 'gt':
          case 'lte':
          case 'gte':
          case 'contains':
          case 'startsWith':
          case 'endsWith':
            where[field as string] = { [operator]: value }
            break
          case 'in':
          case 'notIn':
            where[field as string] = { [operator]: value.split(',') }
            break
          default:
            throw new Error(`Unsupported operator: ${operator}`)
        }
      }
    })
  }

  // Handle ordering functionality
  const validDirections = ['asc', 'desc']
  const orderBy: { [key: string]: string }[] = []
  if (!isEmpty(orders)) {
    orders.forEach((order) => {
      const [field, direction] = order.split(splitter)
      if (validDirections.includes(direction)) {
        orderBy.push({ [field]: direction })
      }
    })
  }

  const res = {
    where,
    take: limit,
    skip,
    orderBy,
  }
  return res as T
}
