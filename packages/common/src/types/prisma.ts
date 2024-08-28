import { Prisma } from '@prisma/client'

export type {
  User,
  Account,
  Role,
  Permission,
  Resource,
  Log,
  VCode,
  Dict,
} from '@prisma/client'

export {
  TAccountProvider,
  TResourceOpenTarget,
  TAccountType,
  TUserGender,
} from '@prisma/client'

export { Prisma } from '@prisma/client'

export type JsonValueInput = Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue
