import { ApiProperty } from '@nestjs/swagger'

export class AppDto {
  @ApiProperty({ description: 'Name of the app' })
  name: string

  @ApiProperty({ description: 'Description of the app' })
  description: string

  @ApiProperty({ description: 'Keywords of the app' })
  keywords: string[]

  @ApiProperty({ description: 'Version of the app' })
  version: string

  @ApiProperty({ description: 'Author of the app' })
  author: string
}
