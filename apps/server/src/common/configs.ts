import { env } from 'node:process'
import type { IPublicConfig } from 'src/types'

const configs: Record<'dev' | 'test' | 'prod' | 'common', IPublicConfig> = {
  dev: {
    baseUrl: 'http://localhost:3003',
  },
  test: {
    baseUrl: 'http://localhost:3003',
  },
  prod: {
    baseUrl: 'https://nextboard.xsin.work',
  },
  common: {
    baseUrl: 'https://nextboard.xsin.work',
    apiPrefix: 'api',
    resendFrom: 'no-reply@xsin.work',
    resendVerifyMailSubject: 'Welcome to NextBoard, Pls verify your email address',
  },
}

export function getConfig(): Record<'public', IPublicConfig> {
  const mode = env.NODE_ENV || 'dev'
  return {
    public: {
      ...configs.common,
      ...configs[mode],
    },
  }
}
