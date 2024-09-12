import { type CustomDecorator, SetMetadata } from '@nestjs/common'

export const ROLES_KEY = 'roles'

export function Roles(...roles: string[]): CustomDecorator {
  return SetMetadata(ROLES_KEY, roles)
}
