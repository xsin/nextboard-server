import { Env } from './env'

export interface IPublicConfig {
  baseUrl: string
  resendFrom?: string
  resendVerifyMailSubject?: string
  apiPrefix?: string
  name?: string
  description?: string
  keywords?: string[]
  version?: string
  author?: string
}

export type IConfigs = Env & {
  public: IPublicConfig
}
