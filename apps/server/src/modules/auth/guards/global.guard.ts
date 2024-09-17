import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { IS_PUBLIC_KEY } from '../decorators/public.decorator'
import { AuthGuard } from './auth.guard'
import { PermissionGuard } from './permission.guard'
import { RoleGuard } from './role.guard'

@Injectable()
export class GlobalGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authGuard: AuthGuard,
    private roleGuard: RoleGuard,
    private permissionGuard: PermissionGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) {
      return true
    }

    const canActivateAuth = await this.authGuard.canActivate(context)
    if (!canActivateAuth) {
      return false
    }

    const canActivateRole = await this.roleGuard.canActivate(context)
    if (!canActivateRole) {
      return false
    }

    const canActivatePermission = await this.permissionGuard.canActivate(context)
    return canActivatePermission
  }
}
