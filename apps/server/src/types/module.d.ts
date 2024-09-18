import type { IUser } from '@nextboard/common'
import type { Env } from './env'

declare global {
  namespace NodeJS {
    export interface ProcessEnv extends Env {}
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: IUser
  }
}
