import { NestFactory } from '@nestjs/core'
import type { NestExpressApplication } from '@nestjs/platform-express'
import { AppModule } from './app.module'
import { AuthService } from './modules/auth/auth.service'
import { getConfig } from './common/configs'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  // Set Global Prefix
  const apiPrefix = getConfig().public.apiPrefix
  app.setGlobalPrefix(apiPrefix ?? '')
  // Get the instance of AuthService
  const authProvider = app.get(AuthService)
  app.set('trust proxy', 1)
  // Notice: Setting up the global auth middleware
  // Don't move this logic to a separated NestMiddleware, or the `req.baseUrl` will always be empty.
  // Auth.js depends on `req.baseUrl` to determine the base path of the request.
  // https://github.com/nestjs/nest/issues/630
  const routeAuth = apiPrefix ? `/${apiPrefix}/auth/*` : '/auth/*'
  app.use(routeAuth, authProvider.auth.bind(authProvider))
  await app.listen(3003)
}
bootstrap()
