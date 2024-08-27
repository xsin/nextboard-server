import { VCode } from './prisma'

export interface IVCode extends VCode {}

export interface ICreateVCodeDto {
  owner: string
  code: string
  expiredAt: Date
}
