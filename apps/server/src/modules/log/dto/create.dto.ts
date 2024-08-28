import { IsBoolean, IsEmail, IsObject, IsOptional, IsString } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ICreateLogDto, NullOptional } from '@nextboard/common'

export class CreateLogDto implements ICreateLogDto {
  @ApiPropertyOptional({ description: 'User ID associated with the log entry' })
  @IsString()
  @IsOptional()
  userId: NullOptional<string>

  @ApiPropertyOptional({ description: 'User email associated with the log entry' })
  @IsEmail()
  @IsOptional()
  userEmail: NullOptional<string>

  @ApiPropertyOptional({ description: 'IP address from which the log entry was created' })
  @IsString()
  @IsOptional()
  ip: NullOptional<string>

  @ApiPropertyOptional({ description: 'User agent string from which the log entry was created' })
  @IsString()
  @IsOptional()
  userAgent: NullOptional<string>

  @ApiProperty({ description: 'Operation performed that is being logged' })
  @IsString()
  operation: string

  @ApiPropertyOptional({ description: 'Log level', default: 'info' })
  @IsString()
  @IsOptional()
  level: NullOptional<string> = 'info'

  @ApiPropertyOptional({ description: 'Additional metadata for the log entry', type: 'object' })
  @IsObject()
  @IsOptional()
  meta?: NullOptional<Record<string, any>>

  @ApiPropertyOptional({ description: 'Indicates if the log entry is system-generated', default: false })
  @IsBoolean()
  @IsOptional()
  isSystem: NullOptional<boolean> = false
}
