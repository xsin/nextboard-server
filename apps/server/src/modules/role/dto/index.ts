import { Prisma } from '@prisma/client'

export * from './create-role.dto'
export * from './update-role.dto'

type TRole = Prisma.RoleGetPayload<Prisma.RoleDefaultArgs>

export interface IRole extends TRole {}
