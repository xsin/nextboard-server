import { KeysOf } from './common'
import type {
  Permission,
  Resource,
  Role,
  User,
} from './prisma'

export interface IUserToken {
  accessToken?: string
  refreshToken?: string
  accessTokenExpiredAt?: Date
  refreshTokenExpiredAt?: Date
}

export interface IUserExtra extends IUserToken {
  roles?: Role[]
  roleNames?: string[]
  permissions?: Permission[]
  permissionNames?: string[]
  resources?: Resource[]
}

/**
 * Public (Non-confidential) user data
 */
export interface IUser extends Omit<User, 'password'>, IUserExtra {}

/**
 * User data with confidential information like `password`
 */
export interface IUserFull extends User, IUserExtra {}

/**
 * JWT Payload
 */
export interface IUserTokenPayload {
  iss: string
  username: string
  sub: string
}

export type TUserProfileFields = KeysOf<IUser, 'roles' | 'permissions' | 'resources' | 'online' | 'disabled' | 'createdBy' | 'updatedBy'>

export interface IUserProfile extends Pick<IUser, TUserProfileFields> {}
