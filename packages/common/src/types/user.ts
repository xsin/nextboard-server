import { IListQueryResult, KeysOf } from './common'
import {
  Permission,
  Resource,
  Role,
  User,
} from './prisma'

export interface ICreateUserDto {
  email: string
  password: string
  password1: string
  name?: string
  displayName?: string
  emailVerifiedAt?: Date
  avatar?: string
}

export interface IUpdateUserDto extends Partial<ICreateUserDto> {}

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

export interface IUserList extends IListQueryResult<IUser> {}

export type TUserProfileFields = KeysOf<IUser, 'roles' | 'permissions' | 'resources' | 'online' | 'disabled' | 'createdBy' | 'updatedBy'>

export interface IUserProfile extends Pick<IUser, TUserProfileFields> {}
