import { ApiProperty } from '@nestjs/swagger'
import type { IResource, IResourceList, TResourceOpenTarget } from '@nextboard/common'
import { ApiResponse, ListQueryResult } from 'src/common/dto'

export * from './create.dto'
export * from './update.dto'

export class ResourceDto implements IResource {
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

export class ResourceListDto extends ListQueryResult<ResourceDto> implements IResourceList {
  @ApiProperty({ type: [ResourceDto], description: 'List of items' })
  items: ResourceDto[]
}

export class ResourceListApiResponse extends ApiResponse<ResourceListDto> {
  @ApiProperty({ type: ResourceListDto })
  data: ResourceListDto
}
