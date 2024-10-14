import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Prisma } from '@xsin/xboard'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreatePermissionDto implements Prisma.PermissionCreateInput {
  @ApiProperty({
    description: 'Permission name',
    example: 'user.create',
  })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiPropertyOptional({
    description: 'Permission display name',
  })
  @IsString()
  @IsOptional()
  displayName?: string

  @ApiPropertyOptional({
    description: 'Permission remark',
  })
  @IsString()
  @IsOptional()
  remark?: string
}
