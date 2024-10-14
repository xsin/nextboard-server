import type {
  Dict,
  Prisma,
} from '@xsin/xboard'
import { ApiProperty } from '@nestjs/swagger'

export class DictDto implements Dict {
  @ApiProperty({
    description: 'ID',
  })
  id: string

  @ApiProperty({
    description: 'Name',
  })
  name: string

  @ApiProperty({
    description: 'Content',
  })
  content: string

  @ApiProperty({
    description: 'Type',
  })
  type: string

  @ApiProperty({
    description: 'Display name',
  })
  displayName: string | null

  @ApiProperty({ description: 'Additional metadata for the dict entry', type: 'object' })
  meta: Prisma.JsonValue | null

  @ApiProperty({ description: 'Remarks' })
  remark: string | null

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date

  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date

  @ApiProperty({ description: 'Created by' })
  createdBy: string | null

  @ApiProperty({ description: 'Updated by' })
  updatedBy: string | null
}
