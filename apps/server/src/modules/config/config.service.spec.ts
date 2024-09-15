import fs from 'node:fs'
import path from 'node:path'
import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AppConfigService } from './config.service'
import * as C from './utils/consts'

vi.mock('node:fs')
vi.mock('node:path')

describe('appConfigService', () => {
  let service: AppConfigService
  let configService: ConfigService

  const mockConfig = {
    [C.C_NODE_ENV]: 'development',
    [C.C_BASE_URL]: 'http://localhost:3000',
    [C.C_API_PREFIX]: '/api',
    [C.C_RESEND_API_KEY]: 'test_key',
    [C.C_RESEND_FROM]: 'test@example.com',
    [C.C_NB_MAIL_SUBJECT_VERIFY]: 'Verify your email',
    [C.C_DATABASE_URL]: 'postgresql://user:password@localhost:5432/db',
    [C.C_DIRECT_URL]: 'postgresql://user:password@localhost:5432/db',
    [C.C_JWT_EXPIRY]: 3600,
    [C.C_JWT_SECRET]: 'secret',
    [C.C_JWT_REFRESH_EXPIRY]: 86400,
    [C.C_JWT_REFRESH_SECRET]: 'refresh_secret',
    [C.C_DEFAULT_ROLE_ID]: 'default_role_id',
    [C.C_OTP_EXPIRY]: 300,
    [C.C_APP_PORT]: 3000,
    [C.C_NB_SMTP_HOST]: 'smtp.example.com',
    [C.C_NB_SMTP_PORT]: 587,
    [C.C_NB_SMTP_USER]: 'user',
    [C.C_NB_SMTP_PASS]: 'password',
    [C.C_NB_SMTP_SECURE]: false,
    [C.C_NB_MAIL_VERIFY_EXPIRY]: 86400,
  }

  const mockPackageInfo = {
    name: 'test-app',
    description: 'A test application',
    keywords: ['test', 'app'],
    version: '1.0.0',
    author: {
      name: 'Test Author',
      email: 'test@example.com',
    },
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppConfigService,
        {
          provide: ConfigService,
          useValue: {
            get: vi.fn((key: string) => mockConfig[key]),
          },
        },
      ],
    }).compile()

    service = module.get<AppConfigService>(AppConfigService)
    configService = module.get<ConfigService>(ConfigService)

    // Mock fs.existsSync and fs.readFileSync
    vi.spyOn(fs, 'existsSync').mockReturnValue(true)
    vi.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(mockPackageInfo))

    // Mock path.resolve
    vi.spyOn(path, 'resolve').mockReturnValue('/mock/path/package.json')
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should load configuration values', () => {
    expect(service.NODE_ENV).toBe(mockConfig[C.C_NODE_ENV])
    expect(service.NB_BASE_URL).toBe(mockConfig[C.C_BASE_URL])
    expect(service.NB_API_PREFIX).toBe(mockConfig[C.C_API_PREFIX])
    expect(service.RESEND_API_KEY).toBe(mockConfig[C.C_RESEND_API_KEY])
    expect(service.RESEND_FROM).toBe(mockConfig[C.C_RESEND_FROM])
    expect(service.NB_MAIL_SUBJECT_VERIFY).toBe(mockConfig[C.C_NB_MAIL_SUBJECT_VERIFY])
    expect(service.DATABASE_URL).toBe(mockConfig[C.C_DATABASE_URL])
    expect(service.DIRECT_URL).toBe(mockConfig[C.C_DIRECT_URL])
    expect(service.JWT_EXPIRY).toBe(mockConfig[C.C_JWT_EXPIRY])
    expect(service.JWT_SECRET).toBe(mockConfig[C.C_JWT_SECRET])
    expect(service.JWT_REFRESH_EXPIRY).toBe(mockConfig[C.C_JWT_REFRESH_EXPIRY])
    expect(service.JWT_REFRESH_SECRET).toBe(mockConfig[C.C_JWT_REFRESH_SECRET])
    expect(service.NB_DEFAULT_ROLE_ID).toBe(mockConfig[C.C_DEFAULT_ROLE_ID])
    expect(service.NB_OTP_EXPIRY).toBe(mockConfig[C.C_OTP_EXPIRY])
    expect(service.NB_APP_PORT).toBe(mockConfig[C.C_APP_PORT])
    expect(service.NB_SMTP_HOST).toBe(mockConfig[C.C_NB_SMTP_HOST])
    expect(service.NB_SMTP_PORT).toBe(mockConfig[C.C_NB_SMTP_PORT])
    expect(service.NB_SMTP_USER).toBe(mockConfig[C.C_NB_SMTP_USER])
    expect(service.NB_SMTP_PASS).toBe(mockConfig[C.C_NB_SMTP_PASS])
    expect(service.NB_SMTP_SECURE).toBe(mockConfig[C.C_NB_SMTP_SECURE])
    expect(service.NB_MAIL_VERIFY_EXPIRY).toBe(mockConfig[C.C_NB_MAIL_VERIFY_EXPIRY])
  })

  it('should load package information', () => {
    expect(service.name).toBe(mockPackageInfo.name)
    expect(service.description).toBe(mockPackageInfo.description)
    expect(service.keywords).toEqual(mockPackageInfo.keywords)
    expect(service.version).toBe(mockPackageInfo.version)
    expect(service.author).toEqual(mockPackageInfo.author)
  })

  it('should handle missing package.json', () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(false)
    const newService = new AppConfigService(configService)
    expect(newService.name).toBeUndefined()
    expect(newService.description).toBeUndefined()
    expect(newService.keywords).toBeUndefined()
    expect(newService.version).toBeUndefined()
    expect(newService.author).toBeUndefined()
  })
})
