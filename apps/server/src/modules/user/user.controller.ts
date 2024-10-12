import { NBApiResponse, NBApiResponsePaginated } from '@/common/decorators/api.decorator'
import { ListQueryDto, ListQueryResult } from '@/common/dto'
import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, Request as Req, Res } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { EmailType, IUserProfile, NBError, TPermission } from '@nextboard/common'
import { TAccountProvider, TAccountType } from '@prisma/client'
import { Request, Response } from 'express'
import { CreateAccountDto } from '../account/dto/create.dto'
import { Permissions } from '../auth/decorators/permissions.decorator'
import { Public } from '../auth/decorators/public.decorator'
import { ResourceDto } from '../resource/dto/resource.dto'
import { VCodeService } from '../vcode/vcode.service'
import { CreateUserDto } from './dto/create.dto'
import { UserProfileDto } from './dto/profile.dto'
import { UpdateUserDto } from './dto/update.dto'
import { UserDto } from './dto/user.dto'
import { UserService } from './user.service'

@ApiBearerAuth()
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly vcodeService: VCodeService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @NBApiResponse(UserDto, {
    description: 'Create a new user',
  })
  @Permissions(TPermission.USER_CREATE)
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
    }
    return this.userService.create(dto, createAccountDto)
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @NBApiResponsePaginated(UserDto, {
    description: 'Get all users',
  })
  @Permissions(TPermission.USER_SELECT)
  async findAll(@Query() dto: ListQueryDto): Promise<ListQueryResult<UserDto>> {
    return this.userService.findAll(dto)
  }

  @NBApiResponsePaginated(ResourceDto, {
    description: 'Get user resources',
  })
  @ApiOperation({ summary: 'Get user resources' })
  @Get('resources')
  @Permissions(TPermission.USER_SELECT)
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

  @Patch('me')
  @NBApiResponse(UserProfileDto, {
    description: 'Update self profile',
  })
  @ApiOperation({ summary: 'Update self profile' })
  async updateSelf(@Req() req: Request, @Body() dto: UpdateUserDto): Promise<UserProfileDto> {
    const user = await this.userService.update(req.user?.id, dto)
    // Convert to UserProfileDto
    const userProfileDto: IUserProfile = {
      id: user.id,
      name: user.name,
      displayName: user.displayName,
      email: user.email,
      avatar: user.avatar,
      emailVerifiedAt: user.emailVerifiedAt,
      gender: user.gender,
      birthday: user.birthday,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      loginAt: user.loginAt,
    }
    return userProfileDto
  }

  @Public()
  @ApiOperation({ summary: 'Verify user email', security: [] })
  @ApiQuery({ name: 'redirect', required: false, description: 'Optional redirect URL after verification' })
  @Get('verify')
  async verifyEmail(
    @Res() res: Response,
    @Query('email') email: string,
    @Query('vcode') vcode: string,
    @Query('redirect') redirect: string,
  ): Promise<void> {
    if (!email || !vcode) {
      throw new BadRequestException(NBError.INVALID_PARAMETERS)
    }

    // Verify the vcode
    const owner = this.vcodeService.generateOwner(email, EmailType.VERIFY)
    const isValid = await this.vcodeService.verify({
      owner,
      code: vcode,
    })

    if (!isValid) {
      if (redirect) {
        return res.redirect(`${redirect}?error=${NBError.AUTH_INVALID_OTP}`)
      }
      throw new BadRequestException(NBError.AUTH_INVALID_OTP)
    }

    await this.userService.verifyEmail(email)
    if (redirect) {
      return res.redirect(`${redirect}?success=true`)
    }

    res.status(HttpStatus.OK).json('Email verified successfully')
  }

  // Put the general endpoints at the bottom, or they will override the specific ones
  // In NestJS, routes are matched in order, so the `/user/:id` route will match any path that starts with `/user/`, including `/user/verify`.
  // To avoid such conflicts, you need to ensure that more specific routes (like `/user/verify`) are defined before more general routes (like `/user/:id`).

  @Get(':id')
  @NBApiResponse(UserDto, {
    description: 'Get a user by ID',
  })
  @ApiOperation({ summary: 'Get a user by ID' })
  @Permissions(TPermission.USER_SELECT)
  async findOne(@Param('id') id: string): Promise<UserDto> {
    return this.userService.findOne(id)
  }

  @Patch(':id')
  @NBApiResponse(UserDto, {
    description: 'Update a user by ID',
  })
  @ApiOperation({ summary: 'Update a user by ID' })
  @Permissions(TPermission.USER_UPDATE)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<UserDto> {
    return this.userService.update(id, updateUserDto)
  }

  @Delete(':id')
  @NBApiResponse(UserDto, {
    description: 'Delete a user by ID',
  })
  @ApiOperation({ summary: 'Delete a user by ID' })
  @Permissions(TPermission.USER_DELETE)
  async remove(@Param('id') id: string): Promise<UserDto> {
    return this.userService.remove(id)
  }
}
