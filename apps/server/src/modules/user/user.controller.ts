import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query, Request as Req } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Request } from 'express'
import { TPermission } from '@nextboard/common'
import { TAccountProvider, TAccountType } from '@prisma/client'
import { Permissions } from '../auth/decorators/permissions.decorator'
import { CreateAccountDto } from '../account/dto/create.dto'
import { ResourceDto } from '../resource/dto/resource.dto'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create.dto'
import { UpdateUserDto } from './dto/update.dto'
import { UserDto } from './dto/user.dto'
import { UserProfileDto } from './dto/profile.dto'
import { ListQueryDto, ListQueryResult } from '@/common/dto'
import { NBApiResponse, NBApiResponsePaginated } from '@/common/decorators/api.decorator'

@ApiBearerAuth()
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @NBApiResponse(UserDto, {
    description: 'Create a new user',
  })
  async create(@Body() dto: CreateUserDto): Promise<UserDto> {
    const createAccountDto: CreateAccountDto = {
      type: TAccountType.local,
      provider: TAccountProvider.localPwd,
      providerAccountId: dto.email,
      accessToken: null,
      refreshToken: null,
      expiredAt: null,
      refreshExpiredAt: null,
      tokenType: null,
      scope: null,
      idToken: null,
      sessionState: null,
      userId: null,
    }
    return this.userService.create(dto, createAccountDto)
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @NBApiResponsePaginated(UserDto, {
    description: 'Get all users',
  })
  async findAll(@Query() dto: ListQueryDto): Promise<ListQueryResult<UserDto>> {
    return this.userService.findAll(dto)
  }

  @Get(':id')
  @NBApiResponse(UserDto, {
    description: 'Get a user by ID',
  })
  @ApiOperation({ summary: 'Get a user by ID' })
  async findOne(@Param('id') id: string): Promise<UserDto> {
    return this.userService.findOne(id)
  }

  @Patch(':id')
  @NBApiResponse(UserDto, {
    description: 'Update a user by ID',
  })
  @ApiOperation({ summary: 'Update a user by ID' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<UserDto> {
    return this.userService.update(id, updateUserDto)
  }

  @Delete(':id')
  @NBApiResponse(UserDto, {
    description: 'Delete a user by ID',
  })
  @ApiOperation({ summary: 'Delete a user by ID' })
  async remove(@Param('id') id: string): Promise<UserDto> {
    return this.userService.remove(id)
  }

  @NBApiResponsePaginated(ResourceDto, {
    description: 'Get user resources',
  })
  @ApiOperation({ summary: 'Get user resources' })
  @Get('resources')
  async getResources(@Req() req: Request): Promise<ListQueryResult<ResourceDto>> {
    return this.userService.findUserResources(req.user?.email)
  }

  @NBApiResponse(UserProfileDto, {
    description: 'Get user profile by ID',
  })
  @Get('profile/:id')
  @ApiOperation({ summary: 'Get user profile by ID' })
  @Permissions(TPermission.USER_SELECT)
  async getProfile(@Param('id') id: string): Promise<UserProfileDto> {
    if (!id) {
      throw new BadRequestException('ID parameter is required')
    }
    return this.userService.getUserProfileById(id)
  }

  @NBApiResponse(UserProfileDto, {
    description: 'Get self profile',
  })
  @ApiOperation({ summary: 'Get self profile' })
  @Get('me')
  async getSelfProfile(@Req() req: Request): Promise<UserProfileDto> {
    return this.userService.getUserProfileByEmail(req.user?.email)
  }

  @NBApiResponse(UserDto, {
    description: 'Verify user email',
  })
  @ApiOperation({ summary: 'Verify user email' })
  @Get('verify')
  async verifyEmail(@Query('email') email: string): Promise<UserDto> {
    if (!email) {
      throw new BadRequestException('Email parameter is required')
    }
    return this.userService.verifyEmail(email)
  }
}
