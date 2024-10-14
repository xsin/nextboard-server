import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Prisma } from '@xsin/xboard'
import { IsBoolean, IsString } from 'class-validator'

export class CreateRoleDto implements Prisma.RoleCreateInput {
  @ApiProperty({
    description: 'Role name',
  })
  @IsString()
  name: string

  @ApiPropertyOptional({
    description: 'Role display name',
  })
  @IsString()
  displayName?: string

  @ApiPropertyOptional({
    description: 'Role remark',
  })
  @IsString()
  remark?: string

  @ApiPropertyOptional({
    description: 'Is system role',
  })
  @IsBoolean()
  isSystem?: boolean
}
