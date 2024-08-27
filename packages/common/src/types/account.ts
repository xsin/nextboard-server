import { IListQueryResult } from './common'
import { Account } from './prisma'

export interface IAccount extends Account {}

export interface IAccountList extends IListQueryResult<Account> {}
