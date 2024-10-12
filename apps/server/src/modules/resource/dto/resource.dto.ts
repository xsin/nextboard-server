import type { Resource, TResourceOpenTarget } from '@nextboard/common'
import { ApiProperty } from '@nestjs/swagger'

export class ResourceDto implements Resource {
  @ApiProperty({ description: 'Resource ID' })
  id: string

  @ApiProperty({ description: 'Resource name' })
  name: string

  @ApiProperty({ description: 'Resource display name' })
  displayName: string | null

  @ApiProperty({ description: 'Resource URL' })
  url: string | null

  @ApiProperty({ description: 'Resource icon' })
  icon: string | null

  @ApiProperty({ description: 'Resource visibility' })
  visible: boolean

  @ApiProperty({ description: 'Enable keep-alive cache for the Resource' })
  keepAlive: boolean

  @ApiProperty({ description: 'Resource opening target' })
  target: TResourceOpenTarget

  @ApiProperty({ description: 'Resource remark' })
  remark: string | null

  @ApiProperty({ description: 'Parent Resource ID' })
  parentId: string | null

  @ApiProperty({ description: 'Resource creation date time' })
  createdAt: Date

  @ApiProperty({ description: 'Resource last update date time' })
  updatedAt: Date

  @ApiProperty({ description: 'Resource creator' })
  createdBy: string | null

  @ApiProperty({ description: 'Resource last updater' })
  updatedBy: string | null
}
