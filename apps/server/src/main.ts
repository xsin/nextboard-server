import type { NestExpressApplication } from '@nestjs/platform-express'
import type { NextFunction, Request, Response } from 'express'
import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { HttpExceptionFilter } from './filters/exception.filter'
import { ResponseFormatInterceptor } from './interceptors/response.interceptor'
import { GlobalGuard } from './modules/auth/guards'
import { AppConfigService } from './modules/config/config.service'
import { LogService } from './modules/log/log.service'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.enableCors()

  const configService = app.get(AppConfigService)

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
  app.setGlobalPrefix(configService.NB_API_PREFIX)

  // Set Global AuthGuard
  app.useGlobalGuards(
    app.get(GlobalGuard),
  )

  // Trust proxy
  app.set('trust proxy', 1)

  // Add middleware to redirect root to api root
  app.use('/', (req: Request, res: Response, next: NextFunction) => {
    if (req.path === '/' && configService.NB_API_PREFIX !== '') {
      res.redirect(`/${configService.NB_API_PREFIX}`)
    }
    else {
      next()
    }
  })

  // Swagger Configuration
  const jsonUrl = `${configService.NB_BASE_URL}/${configService.NB_API_PREFIX ?? ''}-json`
  const swaggerCfg = new DocumentBuilder()
    .setTitle(configService.name ?? 'NextBoard API')
    .setDescription(`${configService.description ?? 'NextBoard API'}: <a href="${jsonUrl}" target="_blank">Open API</a>`)
    .setVersion(configService.version ?? '1.0')
    .addBearerAuth()

  const document = SwaggerModule.createDocument(app, swaggerCfg.build())
  SwaggerModule.setup(configService.NB_API_PREFIX ?? '', app, document)

  await app.listen(configService.NB_APP_PORT ?? 3003)
}
bootstrap()
