import { NestFactory } from '@nestjs/core'
import type { NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'
import { AppConfigService } from './modules/config/config.service'
import { ResponseFormatInterceptor } from './interceptors/response.interceptor'
import { HttpExceptionFilter } from './filters/exception.filter'
import { LogService } from './modules/log/log.service'
import { AuthGuard, PermissionGuard, RoleGuard } from './modules/auth/guards'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  const configService = app.get(AppConfigService)
  const configs = configService.config

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
  app.useGlobalFilters(new HttpExceptionFilter(app.get(LogService)))

  // Set Global Prefix
  app.setGlobalPrefix(configs.API_PREFIX ?? '')

  // Set Global AuthGuard
  app.useGlobalGuards(
    app.get(AuthGuard),
    app.get(RoleGuard),
    app.get(PermissionGuard),
  )

  // Get the instance of AuthService
  app.set('trust proxy', 1)

  // Swagger Configuration
  const swaggerCfg = new DocumentBuilder()
    .setTitle(configs.name ?? 'NextBoard API')
    .setDescription(configs.description ?? 'NextBoard API')
    .setVersion(configs.version ?? '1.0')
    .addBearerAuth()

  const document = SwaggerModule.createDocument(app, swaggerCfg.build())
  SwaggerModule.setup(configs.API_PREFIX ?? '', app, document)

  await app.listen(3003)
}
bootstrap()
