import type {
  Prisma,
} from '@xsin/nextboard-common'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsJSON, IsOptional, IsString } from 'class-validator'

export class CreateDictDto implements Prisma.DictCreateInput {
  @ApiProperty({
    description: 'Name',
  })
  @IsString()
  name: string

  @ApiProperty({
    description: 'Content',
  })
  @IsString()
  content: string

  @ApiProperty({
    description: 'Type',
  })
  @IsString()
  type: string

  @ApiPropertyOptional({
    description: 'Display name',
  })
  @IsString()
  @IsOptional()
  displayName?: string

  @ApiPropertyOptional({ description: 'Additional metadata for the dict entry', type: 'object' })
  @IsJSON()
  @IsOptional()
  meta?: Prisma.JsonValue

  @ApiPropertyOptional({ description: 'Remarks' })
  @IsString()
  @IsOptional()
  remark?: string
}
