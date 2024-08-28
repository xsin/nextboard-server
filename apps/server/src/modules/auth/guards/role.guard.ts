import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import type { Request } from 'express'

/**
 * Role guard, checks if the user has any of the required roles to perform the action.
 */
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler())
    if (!requiredRoles) {
      return true
    }

    const request: Request = context.switchToHttp().getRequest()
    const user = request.user

    if (!user) {
      throw new UnauthorizedException('Unauthorized')
    }

    const roleNames = user.roleNames ?? []
    const hasRole = requiredRoles.some(role => roleNames.includes(role))
    if (!hasRole) {
      throw new ForbiddenException('You do not have the required role to perform this action.')
    }

    return true
  }
}
