import { NBApiResponse } from '@/common/decorators/api.decorator'
import { Body, Controller, Post } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { CreateUserDto } from '../user/dto/create.dto'
import { UserDto, UserTokenDto } from '../user/dto/user.dto'
import { AuthService } from './auth.service'
import { Public } from './decorators/public.decorator'
import {
  LoginRequestDto,
  RefreshTokenRequestDto,
} from './dto/login.dto'
import { OTPLoginDto, SendOTPDto, SendOTPRequestDto } from './dto/otp.dto'
import { TokenService } from './token.service'

@Public()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

  @Post('signup')
  @NBApiResponse(UserDto, {
    description: 'Sign up',
  })
  @ApiOperation({
    summary: 'Sign up',
  })
  async signUp(@Body() dto: CreateUserDto): Promise<UserDto> {
    return this.authService.signUp(dto)
  }

  @ApiOperation({
    summary: 'Refresh token',
  })
  @NBApiResponse(UserTokenDto, {
    description: 'Refresh token',
  })
  @Post('refresh')
  async refreshToken(@Body() dto: RefreshTokenRequestDto): Promise<UserTokenDto> {
    return this.tokenService.refreshToken(dto)
  }

  @ApiOperation({
    summary: 'Login',
  })
  @NBApiResponse(UserDto, {
    description: 'Login',
  })
  @Post('login')
  async login(@Body() dto: LoginRequestDto): Promise<UserDto> {
    return this.authService.login(dto)
  }

  @ApiOperation({
    summary: 'Send OTP',
  })
  @NBApiResponse(SendOTPDto, {
    description: 'Send OTP',
  })
  @Post('otp')
  async sendOTP(@Body() dto: SendOTPRequestDto): Promise<SendOTPDto> {
    return this.authService.sendOTP(dto.email)
  }

  @ApiOperation({
    summary: 'Login with OTP',
  })
  @NBApiResponse(UserDto, {
    description: 'Login with OTP',
  })
  @Post('otp/login')
  async loginWithOTP(@Body() dto: OTPLoginDto): Promise<UserDto> {
    return this.authService.loginWithOTP(dto.email, dto.code)
  }
}
