import { NBApiResponse, NBApiResponsePaginated } from '@/common/decorators/api.decorator'
import { ListQueryDto, ListQueryResult } from '@/common/dto'
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { CreateResourceDto } from './dto/create.dto'
import { ResourceDto } from './dto/resource.dto'
import { UpdateResourceDto } from './dto/update.dto'
import { ResourceService } from './resource.service'

@ApiTags('resource')
@Controller('resource')
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @NBApiResponse(ResourceDto, {
    description: 'The created new resource entry',
  })
  @ApiOperation({ summary: 'Create a new resource entry' })
  @Post()
  async create(@Body() createResourceDto: CreateResourceDto): Promise<ResourceDto> {
    return this.resourceService.create(createResourceDto)
  }

  @ApiOperation({ summary: 'Get all resource entries' })
  @NBApiResponsePaginated(ResourceDto, {
    description: 'Get all resource entries',
  })
  @Get()
  async findAll(@Query() dto: ListQueryDto): Promise<ListQueryResult<ResourceDto>> {
    return this.resourceService.findAll(dto)
  }

  @ApiOperation({ summary: 'Get a resource entry by ID' })
  @NBApiResponse(ResourceDto, {
    description: 'Get a resource entry by ID',
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ResourceDto> {
    return this.resourceService.findOne(id)
  }

  @ApiOperation({ summary: 'Update a resource entry by ID' })
  @NBApiResponse(ResourceDto, {
    description: 'Update a resource entry by ID',
  })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateResourceDto): Promise<ResourceDto> {
    return this.resourceService.update(id, dto)
  }

  @ApiOperation({ summary: 'Delete a resource entry by ID' })
  @NBApiResponse(ResourceDto, {
    description: 'Delete a resource entry by ID',
  })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ResourceDto> {
    return this.resourceService.remove(id)
  }
}
