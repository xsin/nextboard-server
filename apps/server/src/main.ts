import { NestFactory } from '@nestjs/core'
import type { NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'
import { AuthService } from './modules/auth/auth.service'
import { getConfig } from './common/configs'
import { ResponseFormatInterceptor } from './interceptors/response.interceptor'
import { HttpExceptionFilter } from './filters/exception.filter'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  const pubConfigs = getConfig().public

  // Set Global Validation Pipe
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
    whitelist: true,
    forbidNonWhitelisted: true,
  }))

  // Unified Response and Exceptions
  app.useGlobalInterceptors(new ResponseFormatInterceptor())
  app.useGlobalFilters(new HttpExceptionFilter())

  // Set Global Prefix
  const apiPrefix = pubConfigs.apiPrefix
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
  app.use(authProvider.authSession.bind(authProvider))

  // Swagger Configuration
  const swaggerCfg = new DocumentBuilder()
    .setTitle(pubConfigs.name ?? 'NextBoard API')
    .setDescription(pubConfigs.description ?? 'NextBoard API')
    .setVersion(pubConfigs.version ?? '1.0')
    .addBearerAuth()

  const document = SwaggerModule.createDocument(app, swaggerCfg.build())
  SwaggerModule.setup(apiPrefix ?? '', app, document)

  await app.listen(3003)
}
bootstrap()
