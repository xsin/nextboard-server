import { Prisma } from '@prisma/client'
import { ListQueryReturnType } from 'src/common/dto'

export * from './create-user.dto'
export * from './update-user.dto'

export type UserQueryReturnDto = Prisma.UserGetPayload<{
  select: {
    id: true
    email: true
    name: true
    displayName: true
    createdAt: true
    updatedAt: true
    emailVerified: true
  }
}>

export type UserQueryReturnType = Promise<UserQueryReturnDto>

export type UserListQueryReturnType = Promise<ListQueryReturnType<UserQueryReturnDto>>
