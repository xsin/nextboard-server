import process from 'node:process'
import { Global, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { validateSync } from 'class-validator'
import { plainToClass } from 'class-transformer'
import { ConfigDto } from './dto'
import { AppConfigService } from './config.service'

function validate(config: Record<string, unknown>): ConfigDto {
  const validatedConfig = plainToClass(ConfigDto, config, { enableImplicitConversion: true })
  const errors = validateSync(validatedConfig, { skipMissingProperties: false })

  if (errors.length > 0) {
    throw new Error(errors.toString())
  }
  return validatedConfig
}

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      // Make the ConfigService available globally
      // Ref: https://docs.nestjs.com/techniques/configuration
      isGlobal: true,
      envFilePath: [
        `.env.${process.env.NODE_ENV || 'development'}`,
        '.env',
      ],
      validate,
    }),
  ],
  providers: [
    AppConfigService,
  ],
  exports: [
    AppConfigService,
  ],
})
export class AppConfigModule {}
