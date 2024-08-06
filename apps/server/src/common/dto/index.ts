import { IsInt, IsOptional, IsString, Min } from 'class-validator'

export class ListQueryDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number

  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number

  @IsOptional()
  @IsString()
  search?: string

  @IsOptional()
  filters?: { [key: string]: any }

  @IsOptional()
  orders?: { field: string, direction: 'asc' | 'desc' }[]
}

export interface ListQueryReturnType<T> {
  items: T[]
  total: number
  page: number
  limit: number
}
