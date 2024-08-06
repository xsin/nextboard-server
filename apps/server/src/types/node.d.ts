import { Env } from './env'

declare namespace NodeJS {
  export interface ProcessEnv extends Env {}
}
