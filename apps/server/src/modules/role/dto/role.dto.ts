import type {
  Role,
} from '@xsin/nextboard-common'
import { ApiProperty } from '@nestjs/swagger'

export class RoleDto implements Role {
  @ApiProperty({
    description: 'ID',
  })
  id: string

  @ApiProperty({
    description: 'Name',
  })
  name: string

  @ApiProperty({
    description: 'Display name',
  })
  displayName: string | null

  @ApiProperty({
    description: 'Remarks',
  })
  remark: string | null

  @ApiProperty({
    description: 'Is system',
  })
  isSystem: boolean | null

  @ApiProperty({
    description: 'Creation date',
  })
  createdAt: Date

  @ApiProperty({
    description: 'Last update date',
  })
  updatedAt: Date

  @ApiProperty({
    description: 'Created by',
  })
  createdBy: string | null

  @ApiProperty({
    description: 'Updated by',
  })
  updatedBy: string | null
}
