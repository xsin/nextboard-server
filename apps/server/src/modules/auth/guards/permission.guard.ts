import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import type { Request } from 'express'

/**
 * Permission guard, checks if the user has any of the required permissions to perform the action.
 */
@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler())
    if (!requiredPermissions) {
      return true
    }

    const request: Request = context.switchToHttp().getRequest()
    const user = request.user

    if (!user) {
      throw new UnauthorizedException('Unauthorized')
    }

    const permissionNames = user.permissionNames ?? []
    const hasPermission = requiredPermissions.some(permission => permissionNames.includes(permission))
    if (!hasPermission) {
      throw new ForbiddenException('You do not have the required permission to perform this action.')
    }

    return true
  }
}
