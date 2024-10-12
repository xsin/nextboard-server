import { Prisma } from '@prisma/client'

export type {
  Account,
  Dict,
  Log,
  Permission,
  Resource,
  Role,
  User,
  VCode,
} from '@prisma/client'

export {
  TAccountProvider,
  TAccountType,
  TResourceOpenTarget,
  TUserGender,
} from '@prisma/client'

export { Prisma } from '@prisma/client'

export type JsonValueInput = Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue
