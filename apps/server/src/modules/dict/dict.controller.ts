import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { DictService } from './dict.service'
import { CreateDictDto } from './dto/create.dto'
import { UpdateDictDto } from './dto/update.dto'
import { DictDto } from './dto/dict.dto'
import { ListQueryDto, ListQueryResult } from '@/common/dto'
import { NBApiResponse, NBApiResponsePaginated } from '@/common/decorators/api.decorator'

@ApiTags('dict')
@Controller('dict')
export class DictController {
  constructor(private readonly dictService: DictService) {}

  @NBApiResponse(DictDto, {
    description: 'The created new dict entry',
  })
  @ApiOperation({ summary: 'Create a new dict entry' })
  @Post()
  async create(@Body() createDictDto: CreateDictDto): Promise<DictDto> {
    return this.dictService.create(createDictDto)
  }

  @ApiOperation({ summary: 'Get all dict entries' })
  @NBApiResponsePaginated(DictDto, {
    description: 'Get all dict entries',
  })
  @Get()
  async findAll(@Query() dto: ListQueryDto): Promise<ListQueryResult<DictDto>> {
    return this.dictService.findAll(dto)
  }

  @ApiOperation({ summary: 'Get a dict entry by ID' })
  @NBApiResponse(DictDto, {
    description: 'Create a new dict entry',
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<DictDto> {
    return this.dictService.findOne(id)
  }

  @ApiOperation({ summary: 'Update a dict entry by ID' })
  @NBApiResponse(DictDto, {
    description: 'Create a new dict entry',
  })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateDictDto): Promise<DictDto> {
    return this.dictService.update(id, dto)
  }

  @ApiOperation({ summary: 'Delete a dict entry by ID' })
  @NBApiResponse(DictDto, {
    description: 'Create a new dict entry',
  })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<DictDto> {
    return this.dictService.remove(id)
  }
}
