import type { IApiResponse, IListQueryDto, IListQueryResult } from '@xsin/nextboard-common'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsInt, IsOptional, IsString, Min } from 'class-validator'

// Swagger uses concrete classes to generate the API documentation
export class ListQueryDto implements IListQueryDto {
  @ApiPropertyOptional({
    description: 'Page number',
    minimum: 1,
    default: 1,
    example: 1,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1

  @ApiPropertyOptional({
    description: 'Number of items per page',
    minimum: 1,
    default: 20,
    example: 20,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 20

  @ApiPropertyOptional({
    description: 'Search term. In a conventional specification of `{term}^{field1,field2}`',
    example: 'john^name,email',
  })
  @IsOptional()
  @IsString()
  search?: string

  @ApiPropertyOptional({
    description: 'Fields to be filtered. Each filter item should be in a conventional specification of `{key}^{operator}^{value}`',
    example: ['name^contains^john', 'createdAt^gte^2021-01-01'],
  })
  @IsOptional()
  filters?: string[]

  @ApiPropertyOptional({
    description: 'Fields to be ordered by. Each filter item should be in a conventional specification of `{key}^{asc|desc}`',
    example: ['name^asc', 'createdAt^desc'],
  })
  @IsOptional()
  orders?: string[]
}

/**
 * ListQueryResult Class
 */
export class ListQueryResult<T> implements IListQueryResult<T> {
  @ApiProperty({ type: [Object], description: 'List of items' })
  items: T[]

  @ApiProperty({ description: 'Total number of items' })
  total: number

  @ApiProperty({ description: 'Current page number' })
  page: number

  @ApiProperty({ description: 'Number of items per page' })
  limit: number
}

/**
 * Unified API response class.
 */
export class ApiResponse<T> implements IApiResponse<T> {
  @ApiProperty({ description: 'Response status' })
  success: boolean

  @ApiProperty({ description: 'Response code' })
  code: number

  @ApiProperty({ description: 'Response message' })
  message: string

  @ApiPropertyOptional({ description: 'Response data' })
  data?: T | null
}
