import type { IConfigDto, IPackageAuthor, IPackageInfo, TNodeEnv } from '@/types'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as C from './utils/consts'

@Injectable()
export class AppConfigService implements IConfigDto {
  name: string
  description: string
  keywords: string[]
  version: string
  author: IPackageAuthor
  NODE_ENV: TNodeEnv
  NB_BASE_URL: string
  NB_API_PREFIX: string
  RESEND_API_KEY: string
  RESEND_FROM: string
  DATABASE_URL: string
  DIRECT_URL: string
  JWT_EXPIRY: number
  JWT_SECRET: string
  JWT_REFRESH_EXPIRY: number
  JWT_REFRESH_SECRET: string
  NB_DEFAULT_ROLE_ID: string
  NB_OTP_EXPIRY: number
  NB_APP_PORT: number
  NB_SMTP_HOST: string
  NB_SMTP_PORT: number
  NB_SMTP_PASS: string
  NB_SMTP_USER: string
  NB_SMTP_SECURE: boolean
  NB_MAIL_SUBJECT_VERIFY: string
  NB_MAIL_SUBJECT_OTP: string
  NB_MAIL_VERIFY_EXPIRY: number
  NB_MAIL_RESEND_INTERVAL: number
  NB_BRAND_NAME: string
  // Redis
  NB_REDIS_HOST: string
  NB_REDIS_PORT: number
  NB_REDIS_TTL_COMMON: number
  NB_REDIS_TTL_JWT_USER: number
  NB_REDIS_MAX_ITEMS: number

  private pkgInfo: IPackageInfo

  constructor(private configService: ConfigService) {
    this.NODE_ENV = this.configService.get<TNodeEnv>(C.C_NODE_ENV)
    this.NB_BASE_URL = this.configService.get<string>(C.C_BASE_URL)
    this.NB_API_PREFIX = this.configService.get<string>(C.C_API_PREFIX)
    this.RESEND_API_KEY = this.configService.get<string>(C.C_RESEND_API_KEY)
    this.RESEND_FROM = this.configService.get<string>(C.C_RESEND_FROM)
    this.DATABASE_URL = this.configService.get<string>(C.C_DATABASE_URL)
    this.DIRECT_URL = this.configService.get<string>(C.C_DIRECT_URL)
    this.JWT_EXPIRY = this.configService.get<number>(C.C_JWT_EXPIRY)
    this.JWT_SECRET = this.configService.get<string>(C.C_JWT_SECRET)
    this.JWT_REFRESH_EXPIRY = this.configService.get<number>(C.C_JWT_REFRESH_EXPIRY)
    this.JWT_REFRESH_SECRET = this.configService.get<string>(C.C_JWT_REFRESH_SECRET)
    this.NB_DEFAULT_ROLE_ID = this.configService.get<string>(C.C_DEFAULT_ROLE_ID)
    this.NB_OTP_EXPIRY = this.configService.get<number>(C.C_OTP_EXPIRY)
    this.NB_MAIL_RESEND_INTERVAL = this.configService.get<number>(C.C_NB_MAIL_RESEND_INTERVAL)
    this.NB_APP_PORT = this.configService.get<number>(C.C_APP_PORT)
    this.NB_SMTP_HOST = this.configService.get<string>(C.C_NB_SMTP_HOST)
    this.NB_SMTP_PORT = this.configService.get<number>(C.C_NB_SMTP_PORT)
    this.NB_SMTP_USER = this.configService.get<string>(C.C_NB_SMTP_USER)
    this.NB_SMTP_PASS = this.configService.get<string>(C.C_NB_SMTP_PASS)
    this.NB_SMTP_SECURE = this.configService.get<boolean>(C.C_NB_SMTP_SECURE)
    this.NB_MAIL_SUBJECT_VERIFY = this.configService.get<string>(C.C_NB_MAIL_SUBJECT_VERIFY)
    this.NB_MAIL_SUBJECT_OTP = this.configService.get<string>(C.C_NB_MAIL_SUBJECT_OTP)
    this.NB_MAIL_VERIFY_EXPIRY = this.configService.get<number>(C.C_NB_MAIL_VERIFY_EXPIRY)
    this.NB_BRAND_NAME = this.configService.get<string>(C.C_NB_BRAND_NAME)
    this.NB_REDIS_HOST = this.configService.get<string>(C.C_REDIS_HOST)
    this.NB_REDIS_PORT = this.configService.get<number>(C.C_REDIS_PORT)
    this.NB_REDIS_TTL_COMMON = this.configService.get<number>(C.C_REDIS_TTL_COMMON)
    this.NB_REDIS_TTL_JWT_USER = this.configService.get<number>(C.C_REDIS_TTL_JWT_USER)
    this.NB_REDIS_MAX_ITEMS = this.configService.get<number>(C.C_REDIS_MAX_ITEMS)

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
