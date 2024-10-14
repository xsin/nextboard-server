import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Prisma, TResourceOpenTarget } from '@xsin/xboard'
import { IsBoolean, IsOptional, IsString } from 'class-validator'

export class CreateResourceDto implements Prisma.ResourceCreateInput {
  @ApiProperty({
    description: 'Resource name',
  })
  @IsString()
  name: string

  @ApiPropertyOptional({
    description: 'Resource display name',
  })
  @IsString()
  @IsOptional()
  displayName?: string

  @ApiProperty({
    description: 'Resource visibility',
  })
  @IsBoolean()
  visible: boolean

  @ApiProperty({
    description: 'Resource keep alive',
  })
  @IsBoolean()
  keepAlive: boolean

  @ApiProperty({
    description: 'Resource icon',
  })
  @IsString()
  @IsOptional()
  icon?: string

  @ApiProperty({
    description: 'Resource path',
  })
  @IsString()
  @IsOptional()
  url?: string

  @ApiProperty({
    description: 'Resource target',
  })
  @IsString()
  @IsOptional()
  target?: TResourceOpenTarget

  @ApiPropertyOptional({
    description: 'Resource remark',
  })
  @IsString()
  @IsOptional()
  remark?: string

  @ApiProperty({
    description: 'Resource parent id',
  })
  @IsString()
  @IsOptional()
  parentId?: string
}
