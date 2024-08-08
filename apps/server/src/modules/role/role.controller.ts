import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '../auth/guards'
import { RoleService } from './role.service'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'

@ApiTags('role')
@UseGuards(AuthGuard)
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto)
  }

  @Get()
  findAll() {
    return this.roleService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(id, updateRoleDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roleService.remove(id)
  }
}
