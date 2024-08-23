import { ApiProperty } from '@nestjs/swagger'
import { $Enums, Prisma } from '@prisma/client'
import { ApiResponseX, IListQueryResult, ListQueryResult } from 'src/common/dto'

export * from './createResource.dto'
export * from './updateResource.dto'

type TResource = Prisma.ResourceGetPayload<Prisma.ResourceDefaultArgs>

type TResourceOpenTarget = $Enums.TResourceOpenTarget

export interface IResource extends TResource {}

export type IResourceList = IListQueryResult<IResource>

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

export class ResourceListApiResponse extends ApiResponseX<ResourceListDto> {
  @ApiProperty({ type: ResourceListDto })
  data: ResourceListDto
}
