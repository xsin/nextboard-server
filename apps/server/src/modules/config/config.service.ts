import path from 'node:path'
import fs from 'node:fs'
import process from 'node:process'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { IConfigDto, IPackageAuthor, IPackageInfo, TNodeEnv } from './dto'
import * as C from './utils/consts'

@Injectable()
export class AppConfigService implements IConfigDto {
  name: string
  description: string
  keywords: string[]
  version: string
  author: IPackageAuthor
  NODE_ENV: TNodeEnv
  BASE_URL: string
  API_PREFIX: string
  RESEND_API_KEY: string
  RESEND_FROM: string
  RESEND_VERIFY_MAIL_SUBJECT: string
  DATABASE_URL: string
  DIRECT_URL: string
  JWT_EXPIRY: number
  JWT_SECRET: string
  JWT_REFRESH_EXPIRY: number
  JWT_REFRESH_SECRET: string
  DEFAULT_ROLE_ID: string
  OTP_EXPIRY: number

  private pkgInfo: IPackageInfo

  constructor(private configService: ConfigService) {
    this.NODE_ENV = this.configService.get<TNodeEnv>(C.C_NODE_ENV)
    this.BASE_URL = this.configService.get<string>(C.C_BASE_URL)
    this.API_PREFIX = this.configService.get<string>(C.C_API_PREFIX)
    this.RESEND_API_KEY = this.configService.get<string>(C.C_RESEND_API_KEY)
    this.RESEND_FROM = this.configService.get<string>(C.C_RESEND_FROM)
    this.RESEND_VERIFY_MAIL_SUBJECT = this.configService.get<string>(C.C_RESEND_VERIFY_MAIL_SUBJECT)
    this.DATABASE_URL = this.configService.get<string>(C.C_DATABASE_URL)
    this.DIRECT_URL = this.configService.get<string>(C.C_DIRECT_URL)
    this.JWT_EXPIRY = this.configService.get<number>(C.C_JWT_EXPIRY)
    this.JWT_SECRET = this.configService.get<string>(C.C_JWT_SECRET)
    this.JWT_REFRESH_EXPIRY = this.configService.get<number>(C.C_JWT_REFRESH_EXPIRY)
    this.JWT_REFRESH_SECRET = this.configService.get<string>(C.C_JWT_REFRESH_SECRET)
    this.DEFAULT_ROLE_ID = this.configService.get<string>(C.C_DEFAULT_ROLE_ID)
    this.OTP_EXPIRY = this.configService.get<number>(C.C_OTP_EXPIRY)

    this.getPkgInfo()
  }

  private getPkgInfo(): void {
    const pkgPath = path.resolve(process.cwd(), 'package.json')
    console.warn(`💡Load Package Info from: ${pkgPath}`)

    if (fs.existsSync(pkgPath)) {
      this.pkgInfo = JSON.parse(fs.readFileSync(pkgPath, 'utf-8')) as IPackageInfo
      this.name = this.pkgInfo.name
      this.description = this.pkgInfo.description
      this.keywords = this.pkgInfo.keywords
      this.version = this.pkgInfo.version
      this.author = this.pkgInfo.author
    }
  }
}
