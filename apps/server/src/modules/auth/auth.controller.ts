import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import {
  CreateUserDto,
  UserApiResponse,
  UserDto,
  UserTokenDto,
} from '../user/dto'
import { TokenService } from './token.service'
import { AuthService } from './auth.service'
import {
  LoginApiResponse,
  LoginRequestDto,
  RefreshTokenApiResponse,
  RefreshTokenRequestDto,
} from './dto'
import { OTPLoginDto, SendOTPApiResponse, SendOTPDto, SendOTPRequestDto } from './dto/otp.dto'
import { PublicGuard } from './guards'

@UseGuards(
  PublicGuard,
)
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

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
    return this.tokenService.refreshToken(dto)
  }

  @ApiResponse({
    type: LoginApiResponse,
  })
  @Post('login')
  async login(@Body() dto: LoginRequestDto): Promise<UserDto> {
    return this.authService.login(dto)
  }

  @ApiResponse({
    type: SendOTPApiResponse,
  })
  @Post('otp')
  async sendOTP(@Body() dto: SendOTPRequestDto): Promise<SendOTPDto> {
    return this.authService.sendOTP(dto.email)
  }

  @Post('login/otp')
  async loginWithOTP(@Body() dto: OTPLoginDto): Promise<UserDto> {
    return this.authService.loginWithOTP(dto.email, dto.code)
  }
}
