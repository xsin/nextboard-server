import { Body, Controller, Post } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { CreateUserDto, UserQueryDto, UserQueryResponse } from '../user/dto'
import { UserService } from '../user/user.service'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  @ApiResponse({
    type: UserQueryResponse,
  })
  async signUp(@Body() dto: CreateUserDto): Promise<UserQueryDto> {
    return this.userService.create(dto)
  }
}
