import { Body, Controller, Post } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { CreateUserDto, UserQueryDto, UserQueryResponse, UserTokenDto } from '../user/dto'
import { AuthService } from './auth.service'
import { RefreshTokenDto, RefreshTokenResponse } from './dto'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiResponse({
    type: UserQueryResponse,
  })
  async signUp(@Body() dto: CreateUserDto): Promise<UserQueryDto> {
    return this.authService.signUp(dto)
  }

  @ApiResponse({
    type: RefreshTokenResponse,
  })
  @Post('refresh')
  async refreshToken(@Body() dto: RefreshTokenDto): Promise<UserTokenDto> {
    return this.authService.refreshToken(dto)
  }
}
