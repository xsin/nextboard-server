import { IUser } from '@nextboard/common'
import type { Env } from './env'

declare namespace NodeJS {
  export interface ProcessEnv extends Env {}
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: IUser
  }
}
