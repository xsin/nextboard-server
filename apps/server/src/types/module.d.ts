import { Request } from 'express'
import { IUserTokenPayload } from 'src/modules/user/dto'
import { Env } from './env'

declare namespace NodeJS {
  export interface ProcessEnv extends Env {}
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: IUserTokenPayload
  }
}
