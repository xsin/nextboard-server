import { describe, expect, it } from 'vitest'
import { ConfigDto } from '../dto/config.dto'
import { validateConfigs } from './validateConfigs'
import 'reflect-metadata'

describe('validateConfigs', () => {
  it('should validate correct configs', () => {
    const validConfig = {
      NODE_ENV: 'development',
      NB_BASE_URL: 'http://localhost:3000',
      NB_API_PREFIX: '/api',
      RESEND_API_KEY: 'test_key',
      RESEND_FROM: 'test@example.com',
      DATABASE_URL: 'postgresql://user:password@localhost:5432/db',
      DIRECT_URL: 'postgresql://user:password@localhost:5432/db',
      JWT_EXPIRY: 3600,
      JWT_SECRET: 'secret',
      JWT_REFRESH_EXPIRY: 86400,
      JWT_REFRESH_SECRET: 'refresh_secret',
      NB_DEFAULT_ROLE_ID: 'default_role_id',
      NB_OTP_EXPIRY: 300,
      NB_APP_PORT: 3000,
      NB_SMTP_HOST: 'smtp.example.com',
      NB_SMTP_PORT: 587,
      NB_SMTP_USER: 'user',
      NB_SMTP_PASS: 'password',
      NB_SMTP_SECURE: false,
      NB_MAIL_SUBJECT_VERIFY: 'Verify your email',
      NB_MAIL_SUBJECT_OTP: 'Your OTP Code',
      NB_MAIL_VERIFY_EXPIRY: 86400,
      NB_BRAND_NAME: 'brand_name',
    }

    const result = validateConfigs(validConfig)
    expect(result).toBeInstanceOf(ConfigDto)
    expect(result).toEqual(expect.objectContaining(validConfig))
  })

  it('should throw error for invalid configs', () => {
    const invalidConfig = {
      NODE_ENV: 'invalid',
      NB_BASE_URL: 'not a url',
      NB_API_PREFIX: 123,
      RESEND_API_KEY: '',
      RESEND_FROM: 'not an email',
      DATABASE_URL: '',
      DIRECT_URL: '',
      JWT_EXPIRY: 'not a number',
      JWT_SECRET: '',
      JWT_REFRESH_EXPIRY: 'not a number',
      JWT_REFRESH_SECRET: '',
      NB_DEFAULT_ROLE_ID: '',
      NB_OTP_EXPIRY: 'not a number',
      NB_APP_PORT: 'not a number',
      NB_SMTP_HOST: 'smtp.example.com',
      NB_SMTP_PORT: 587,
      NB_SMTP_USER: 'user',
      NB_SMTP_PASS: 'password',
      NB_SMTP_SECURE: false,
      NB_MAIL_SUBJECT_VERIFY: '',
      NB_MAIL_SUBJECT_OTP: 'Your OTP Code',
      NB_MAIL_VERIFY_EXPIRY: 86400,
      NB_BRAND_NAME: 'brand_name',
    }

    expect(() => validateConfigs(invalidConfig)).toThrow()
  })

  it('should validate configs with optional fields', () => {
    const configWithOptionals = {
      NODE_ENV: 'production',
      NB_BASE_URL: 'https://example.com',
      NB_API_PREFIX: '/api',
      RESEND_API_KEY: 'test_key',
      RESEND_FROM: 'test@example.com',
      DATABASE_URL: 'postgresql://user:password@localhost:5432/db',
      DIRECT_URL: 'postgresql://user:password@localhost:5432/db',
      JWT_EXPIRY: 3600,
      JWT_SECRET: 'secret',
      JWT_REFRESH_EXPIRY: 86400,
      JWT_REFRESH_SECRET: 'refresh_secret',
      NB_DEFAULT_ROLE_ID: 'default_role_id',
      NB_OTP_EXPIRY: 300,
      NB_APP_PORT: 3000,
      NB_SMTP_HOST: 'smtp.example.com',
      NB_SMTP_PORT: 587,
      NB_SMTP_USER: 'user',
      NB_SMTP_PASS: 'password',
      NB_SMTP_SECURE: false,
      NB_MAIL_SUBJECT_VERIFY: 'Verify your email',
      NB_MAIL_SUBJECT_OTP: 'Your OTP Code',
      NB_MAIL_VERIFY_EXPIRY: 86400,
      NB_BRAND_NAME: 'brand_name',
      name: 'MyApp',
      description: 'My awesome app',
      keywords: ['app', 'awesome'],
      version: '1.0.0',
      author: {
        name: 'John Doe',
        email: 'john@example.com',
        url: 'https://johndoe.com',
      },
    }

    const result = validateConfigs(configWithOptionals)
    expect(result).toBeInstanceOf(ConfigDto)
    expect(result).toEqual(expect.objectContaining(configWithOptionals))
  })
})
