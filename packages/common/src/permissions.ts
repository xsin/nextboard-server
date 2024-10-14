import { Permission } from './prisma'

/**
 * Permission names, in the convention of `{RESOURCE}.{OPERATION}`
 */
export enum TPermission {
  USER_SELECT = 'user.select',
  USER_CREATE = 'user.create',
  USER_UPDATE = 'user.update',
  USER_DELETE = 'user.delete',
  ROLE_SELECT = 'role.select',
  ROLE_CREATE = 'role.create',
  ROLE_UPDATE = 'role.update',
  ROLE_DELETE = 'role.delete',
  PERMISSION_SELECT = 'permission.select',
  PERMISSION_CREATE = 'permission.create',
  PERMISSION_UPDATE = 'permission.update',
  PERMISSION_DELETE = 'permission.delete',
  RESOURCE_SELECT = 'resource.select',
  RESOURCE_CREATE = 'resource.create',
  RESOURCE_UPDATE = 'resource.update',
  RESOURCE_DELETE = 'resource.delete',
  DIC_SELECT = 'dic.select',
  DIC_CREATE = 'dic.create',
  DIC_UPDATE = 'dic.update',
  DIC_DELETE = 'dic.delete',
  LOG_SELECT = 'log.select',
  LOG_DELETE = 'log.delete',
}

export interface IPermission extends Permission {}
