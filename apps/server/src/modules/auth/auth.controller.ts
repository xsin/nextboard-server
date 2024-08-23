import { Body, Controller, Post } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import {
  CreateUserDto,
  UserApiResponse,
  UserDto,
  UserTokenDto,
} from '../user/dto'
import { AuthService } from './auth.service'
import {
  LoginApiResponse,
  LoginRequestDto,
  RefreshTokenApiResponse,
  RefreshTokenRequestDto,
} from './dto'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiResponse({
    type: UserApiResponse,
  })
  async signUp(@Body() dto: CreateUserDto): Promise<UserDto> {
    return this.authService.signUp(dto)
  }

  @ApiResponse({
    type: RefreshTokenApiResponse,
  })
  @Post('refresh')
  async refreshToken(@Body() dto: RefreshTokenRequestDto): Promise<UserTokenDto> {
    return this.authService.refreshToken(dto)
  }

  @ApiResponse({
    type: LoginApiResponse,
  })
  @Post('login')
  async login(dto: LoginRequestDto): Promise<UserDto> {
    return this.authService.login(dto)
  }
}
