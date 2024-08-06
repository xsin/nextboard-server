import type { NestMiddleware } from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import type { NextFunction, Request, Response } from 'express'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor() {}

  use(_req: Request, _res: Response, next: NextFunction): void {
    next()
  }
}
