import { NBApiResponse, NBApiResponsePaginated } from '@/common/decorators/api.decorator'
import { ListQueryDto, ListQueryResult } from '@/common/dto'
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { CreateRoleDto } from './dto/create.dto'
import { RoleDto } from './dto/role.dto'
import { UpdateRoleDto } from './dto/update.dto'
import { RoleService } from './role.service'

@ApiTags('role')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @NBApiResponse(RoleDto, {
    description: 'The created new role',
  })
  @ApiOperation({ summary: 'Create a new role' })
  @Post()
  async create(@Body() createRoleDto: CreateRoleDto): Promise<RoleDto> {
    return this.roleService.create(createRoleDto)
  }

  @ApiOperation({ summary: 'Get all roles' })
  @NBApiResponsePaginated(RoleDto, {
    description: 'Get all roles',
  })
  @Get()
  async findAll(@Query() dto: ListQueryDto): Promise<ListQueryResult<RoleDto>> {
    return this.roleService.findAll(dto)
  }

  @ApiOperation({ summary: 'Get a role by ID' })
  @NBApiResponse(RoleDto, {
    description: 'Get a role by ID',
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<RoleDto> {
    return this.roleService.findOne(id)
  }

  @ApiOperation({ summary: 'Update a role by ID' })
  @NBApiResponse(RoleDto, {
    description: 'Update a role by ID',
  })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateRoleDto): Promise<RoleDto> {
    return this.roleService.update(id, dto)
  }

  @ApiOperation({ summary: 'Delete a role by ID' })
  @NBApiResponse(RoleDto, {
    description: 'Delete a role by ID',
  })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<RoleDto> {
    return this.roleService.remove(id)
  }
}
