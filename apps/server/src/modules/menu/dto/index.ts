import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { $Enums, Prisma } from '@prisma/client'
import { ApiResponseX, IListQueryResult, ListQueryResult } from 'src/common/dto'

export * from './create-menu.dto'
export * from './update-menu.dto'

type TMenu = Prisma.MenuGetPayload<Prisma.MenuDefaultArgs>

type TMenuOpenTarget = $Enums.TMenuOpenTarget

export interface IMenu extends TMenu {
  /**
   * User's permission code (bitwise code) on this menu
   */
  userPermissionCode?: number
}

export type IMenuListQueryDto = IListQueryResult<IMenu>

export class MenuQueryDto implements IMenu {
  @ApiProperty({ description: 'Menu ID' })
  id: string

  @ApiProperty({ description: 'Menu name' })
  name: string

  @ApiProperty({ description: 'Menu display name' })
  displayName: string | null

  @ApiProperty({ description: 'Menu URL' })
  url: string | null

  @ApiProperty({ description: 'Menu icon' })
  icon: string | null

  @ApiProperty({ description: 'Menu visibility' })
  visible: boolean

  @ApiProperty({ description: 'Enable keep-alive cache for the page' })
  keepAlive: boolean

  @ApiProperty({ description: 'Menu opening target' })
  target: TMenuOpenTarget

  @ApiProperty({ description: 'Menu remark' })
  remark: string | null

  @ApiProperty({ description: 'Parent menu ID' })
  parentId: string | null

  @ApiProperty({ description: 'Menu creation date time' })
  createdAt: Date

  @ApiProperty({ description: 'Menu last update date time' })
  updatedAt: Date

  @ApiProperty({ description: 'Menu creator' })
  createdBy: string | null

  @ApiProperty({ description: 'Menu last updater' })
  updatedBy: string | null

  @ApiPropertyOptional({ description: 'User permission code' })
  userPermissionCode?: number
}

export class MenuListQueryDto extends ListQueryResult<MenuQueryDto> implements IMenuListQueryDto {
  @ApiProperty({ type: [MenuQueryDto], description: 'List of items' })
  items: MenuQueryDto[]
}

export class MenuListQueryResponse extends ApiResponseX<MenuListQueryDto> {
  @ApiProperty({ type: MenuListQueryDto })
  data: MenuListQueryDto
}
