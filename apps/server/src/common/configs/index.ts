import path from 'node:path'
import fs from 'node:fs'
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
  const pkgJsonPath = path.resolve(__dirname, '../../../package.json')
  const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'))
  return {
    public: {
      ...configs.common,
      ...configs[mode],
      name: pkgJson.name,
      description: pkgJson.description,
      keywords: pkgJson.keywords,
      version: pkgJson.version,
      author: typeof (pkgJson.author) === 'string' ? pkgJson.author : pkgJson.author.name,
    },
  }
}
