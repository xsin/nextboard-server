import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '../auth/guards'
import { ResourceService } from './resource.service'
import { CreateResourceDto } from './dto/createResource.dto'
import { UpdateResourceDto } from './dto/updateResource.dto'

@ApiTags('resource')
@UseGuards(AuthGuard)
@Controller('resource')
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @Post()
  create(@Body() createMenuDto: CreateResourceDto) {
    return this.resourceService.create(createMenuDto)
  }

  @Get()
  findAll() {
    return this.resourceService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resourceService.findOne(id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateResourceDto: UpdateResourceDto) {
    return this.resourceService.update(id, updateResourceDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resourceService.remove(id)
  }
}
