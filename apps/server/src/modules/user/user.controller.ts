import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, Param, Patch, Post, Query, Request as Req, UseGuards } from '@nestjs/common'
import { ListQueryDto } from 'src/common/dto'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Request } from 'express'
import { isEmpty } from 'radash'
import { TPermission } from '@nextboard/common'
import { ResourceListApiResponse, ResourceListDto } from '../resource/dto'
import { AuthGuard } from '../auth/guards'
import { RoleGuard } from '../auth/guards/role.guard'
import { PermissionGuard } from '../auth/guards/permission.guard'
import { Permissions } from '../auth/decorators/permissions.decorator'
import { UserService } from './user.service'
import {
  CreateUserDto,
  UpdateUserDto,
  UserApiResponse,
  UserDto,
  UserListApiResponse,
  UserListDto,
  UserProfileApiResponse,
  UserProfileDto,
} from './dto'

@UseGuards(AuthGuard, RoleGuard, PermissionGuard)
@ApiBearerAuth()
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiResponse({
    type: UserApiResponse,
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    return this.userService.create(createUserDto)
  }

  @Get()
  @ApiResponse({
    type: UserListApiResponse,
  })
  async findAll(@Query() dto: ListQueryDto): Promise<UserListDto> {
    return this.userService.findAll(dto)
  }

  @Get(':id')
  @ApiResponse({
    type: UserApiResponse,
  })
  async findOne(@Param('id') id: string): Promise<UserDto> {
    return this.userService.findOne(id)
  }

  @Patch(':id')
  @ApiResponse({
    type: UserApiResponse,
  })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<UserDto> {
    return this.userService.update(id, updateUserDto)
  }

  @Delete(':id')
  @ApiResponse({
    type: UserApiResponse,
  })
  async remove(@Param('id') id: string): Promise<UserDto> {
    return this.userService.remove(id)
  }

  @ApiResponse({
    type: ResourceListApiResponse,
  })
  @Get('resources')
  async getResources(@Req() req: Request): Promise<ResourceListDto> {
    return this.userService.findUserResources(req.user?.email)
  }

  @ApiResponse({
    type: UserProfileApiResponse,
    description: 'Get user profile by ID',
  })
  @Get('profile/:id')
  @Permissions(TPermission.USER_SELECT)
  async getProfile(@Param('id') id: string): Promise<UserProfileDto> {
    if (!id) {
      throw new BadRequestException('ID parameter is required')
    }
    return this.userService.getUserProfileById(id)
  }

  @ApiResponse({
    type: UserProfileApiResponse,
    description: 'Get self profile',
  })
  @Get('me')
  async getSelfProfile(@Req() req: Request): Promise<UserProfileDto> {
    return this.userService.getUserProfileByEmail(req.user?.email)
  }

  @ApiResponse({
    type: UserApiResponse,
    description: 'Verify user email',
  })
  @Get('verify')
  async verifyEmail(@Query('email') email: string): Promise<UserDto> {
    if (!email) {
      throw new BadRequestException('Email parameter is required')
    }
    return this.userService.verifyEmail(email)
  }
}
