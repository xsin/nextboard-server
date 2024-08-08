import { Prisma } from '@prisma/client'

export * from './create-permission.dto'
export * from './update-permission.dto'

type TPermission = Prisma.PermissionGetPayload<Prisma.PermissionDefaultArgs>

export interface IPermission extends TPermission {}
