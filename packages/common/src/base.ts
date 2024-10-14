/**
 * @description KeysOf type that gets keys of T, optionally omitting specified keys K
 */
export type KeysOf<T, K extends keyof T = never> = Exclude<keyof T, K>

/**
 * @description Nullable value that can be null
 */
export type Nullable<T> = T | null

/**
 * @description Optional value that can be undefined
 */
export type Optional<T> = T | undefined

/**
 * @description Optional value that can be null
 */
export type NullOptional<T> = Nullable<Optional<T>>

export interface IListQueryResult<T> {
  items: T[]
  total: number
  page: number
  limit: number
}

export interface IListQueryDto {
  page?: number
  limit?: number
  /**
   * Search term
   * In a conventional specification of `{term}^{field1,field2}`
   */
  search?: string
  /**
   * Fields to filter
   * Each filter item should be in a conventional specification of `{key}^{operator}^{value}`
   */
  filters?: string[]
  /**
   * Fields to be ordered by
   * Each filter item should be in a conventional specification of `{key}^{asc|desc}`
   */
  orders?: string[]
}

export interface IApiResponseBase {
  success: boolean
  code: number
  message: string
  data?: unknown
}

export interface IApiResponse<T> extends IApiResponseBase {
  data?: T | null
}

export type FilterOperator = 'equals' | 'not' | 'lt' | 'gt' | 'lte' | 'gte' | 'contains' | 'startsWith' | 'endsWith' | 'in' | 'notIn'
