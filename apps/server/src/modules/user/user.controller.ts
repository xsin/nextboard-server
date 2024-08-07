import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { ListQueryDto } from 'src/common/dto'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserListQueryDto, UserListQueryResponse, UserQueryDto, UserQueryResponse } from './dto'

@ApiBearerAuth()
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiResponse({
    type: UserQueryResponse,
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserQueryDto> {
    return this.userService.create(createUserDto)
  }

  @Get()
  @ApiResponse({
    type: UserListQueryResponse,
  })
  async findAll(@Query() dto: ListQueryDto): Promise<UserListQueryDto> {
    return this.userService.findAll(dto)
  }

  @Get(':id')
  @ApiResponse({
    type: UserQueryResponse,
  })
  async findOne(@Param('id') id: string): Promise<UserQueryDto> {
    return this.userService.findOne(id)
  }

  @Patch(':id')
  @ApiResponse({
    type: UserQueryResponse,
  })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<UserQueryDto> {
    return this.userService.update(id, updateUserDto)
  }

  @Delete(':id')
  @ApiResponse({
    type: UserQueryResponse,
  })
  async remove(@Param('id') id: string): Promise<UserQueryDto> {
    return this.userService.remove(id)
  }
}
