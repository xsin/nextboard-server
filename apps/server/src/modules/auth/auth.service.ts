import { Injectable } from '@nestjs/common'
import type { Provider } from '@auth/express/providers'
import Credentials from '@auth/express/providers/credentials'
import type { NextFunction, Request, Response } from 'express'
import { ExpressAuth } from '@auth/express'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { PrismaService } from 'src/common/prisma.service'

@Injectable()
export class AuthService {
  readonly providers: Provider[]
  constructor(
    private readonly prismaService: PrismaService,
  ) {
    this.providers = [
      this.credentialsProvider(),
    ]
  }

  private credentialsProvider(): Provider {
    return Credentials({
      credentials: {
        username: { label: 'Username' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(_credentials, request) {
        console.log(_credentials)
        const response = await fetch(request)
        if (!response.ok)
          return null
        return (await response.json()) ?? null
      },
    })
  }

  /**
   * Auth middleware, provided by @auth/express
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @param {NextFunction} next - Express next function
   */
  auth(req: Request, res: Response, next: NextFunction): void {
    const expressAuth = ExpressAuth({
      trustHost: true,
      providers: this.providers,
      adapter: PrismaAdapter(this.prismaService),
    })

    expressAuth(req, res, next)
  }
}
