import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Prisma } from '@xsin/xboard'
import { IsBoolean, IsEmail, IsObject, IsOptional, IsString } from 'class-validator'

export class CreateLogDto implements Prisma.LogCreateInput {
  @ApiPropertyOptional({ description: 'User ID associated with the log entry' })
  @IsString()
  @IsOptional()
  userId?: string

  @ApiPropertyOptional({ description: 'User email associated with the log entry' })
  @IsEmail()
  @IsOptional()
  userEmail?: string

  @ApiPropertyOptional({ description: 'IP address from which the log entry was created' })
  @IsString()
  @IsOptional()
  ip?: string

  @ApiPropertyOptional({ description: 'User agent string from which the log entry was created' })
  @IsString()
  @IsOptional()
  userAgent?: string

  @ApiProperty({ description: 'Operation performed that is being logged' })
  @IsString()
  operation: string

  @ApiPropertyOptional({ description: 'Log level', default: 'info' })
  @IsString()
  @IsOptional()
  level?: string = 'info'

  @ApiPropertyOptional({ description: 'Additional metadata for the log entry', type: 'object' })
  @IsObject()
  @IsOptional()
  meta?: Prisma.JsonValue

  @ApiPropertyOptional({ description: 'Indicates if the log entry is system-generated', default: false })
  @IsBoolean()
  @IsOptional()
  isSystem?: boolean = false
}
