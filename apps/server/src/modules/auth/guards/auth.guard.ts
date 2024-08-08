import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthService } from '../auth.service'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const response = context.switchToHttp().getResponse()
    const user = await this.authService.getCurrentUser(request, response)
    // NestJS will throw an `403` error if the guard returns `false`
    // But we want to throw an `401` error
    if (!user) {
      throw new UnauthorizedException('Unauthorized')
    }
    return true
  }
}
