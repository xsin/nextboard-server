import type {
  Account,
} from '@xsin/xboard'
import { ApiProperty } from '@nestjs/swagger'
import { TAccountProvider, TAccountType } from '@xsin/xboard'

export class AccountDto implements Account {
  @ApiProperty({
    description: 'ID',
  })
  id: string

  @ApiProperty({
    description: 'User ID',
  })
  userId: string

  @ApiProperty({
    description: 'Type',
  })
  type: TAccountType

  @ApiProperty({
    description: 'Provider',
  })
  provider: TAccountProvider

  @ApiProperty({
    description: 'Provider Account ID',
  })
  providerAccountId: string

  @ApiProperty({
    description: 'Refresh Token',
  })
  refreshToken: string | null

  @ApiProperty({
    description: 'Access Token',
  })
  accessToken: string | null

  @ApiProperty({
    description: 'Expired At',
  })
  expiredAt: Date | null

  @ApiProperty({
    description: 'Refresh Expired At',
  })
  refreshExpiredAt: Date | null

  @ApiProperty({
    description: 'Token Type',
  })
  tokenType: string | null

  @ApiProperty({
    description: 'Scope',
  })
  scope: string | null

  @ApiProperty({
    description: 'ID Token',
  })
  idToken: string | null

  @ApiProperty({
    description: 'Creation Date',
  })
  createdAt: Date = new Date()

  @ApiProperty({
    description: 'Last Update Date',
  })
  updatedAt: Date = new Date()

  @ApiProperty({
    description: 'Session State',
  })
  sessionState: string | null
}
