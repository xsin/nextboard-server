import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Permission } from '@xsin/xboard'

export class PermissionDto implements Permission {
  @ApiProperty({
    description: 'Permission id',
  })
  id: string

  @ApiProperty({
    description: 'Permission name',
    example: 'user.create',
  })
  name: string

  @ApiPropertyOptional({
    description: 'Permission display name',
    example: 'User Create',
  })
  displayName: string | null

  @ApiPropertyOptional({
    description: 'Permission remark',
  })
  remark: string | null

  @ApiProperty({
    description: 'Permission created at',
    example: '2021-01-01',
  })
  createdAt: Date

  @ApiProperty({
    description: 'Permission updated at',
    example: '2021-01-01',
  })
  updatedAt: Date

  @ApiPropertyOptional({
    description: 'Permission created by',
    example: 'admin',
  })
  createdBy: string

  @ApiPropertyOptional({
    description: 'Permission updated by',
    example: 'admin',
  })
  updatedBy: string
}
