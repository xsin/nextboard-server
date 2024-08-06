import { Env } from './env'

export interface IPublicConfig {
  baseUrl: string
  resendFrom?: string
  resendVerifyMailSubject?: string
  apiPrefix?: string
}

export type IConfigs = Env & {
  public: IPublicConfig
}
