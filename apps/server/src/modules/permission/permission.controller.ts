import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { PermissionService } from './permission.service'
import { CreatePermissionDto } from './dto/create.dto'
import { UpdatePermissionDto } from './dto/update.dto'
import { PermissionDto } from './dto/permission.dto'
import { ListQueryDto, ListQueryResult } from '@/common/dto'
import { NBApiResponse, NBApiResponsePaginated } from '@/common/decorators/api.decorator'

@ApiTags('permission')
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @NBApiResponse(PermissionDto, {
    description: 'The created new permission',
  })
  @ApiOperation({ summary: 'Create a new permission' })
  @Post()
  async create(@Body() createPermissionDto: CreatePermissionDto): Promise<PermissionDto> {
    return this.permissionService.create(createPermissionDto)
  }

  @ApiOperation({ summary: 'Get all permissions' })
  @NBApiResponsePaginated(PermissionDto, {
    description: 'Get all permissions',
  })
  @Get()
  async findAll(@Query() dto: ListQueryDto): Promise<ListQueryResult<PermissionDto>> {
    return this.permissionService.findAll(dto)
  }

  @ApiOperation({ summary: 'Get a permission by ID' })
  @NBApiResponse(PermissionDto, {
    description: 'Get a permission by ID',
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PermissionDto> {
    return this.permissionService.findOne(id)
  }

  @ApiOperation({ summary: 'Update a permission by ID' })
  @NBApiResponse(PermissionDto, {
    description: 'Update a permission by ID',
  })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdatePermissionDto): Promise<PermissionDto> {
    return this.permissionService.update(id, dto)
  }

  @ApiOperation({ summary: 'Delete a permission by ID' })
  @NBApiResponse(PermissionDto, {
    description: 'Delete a permission by ID',
  })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<PermissionDto> {
    return this.permissionService.remove(id)
  }
}
