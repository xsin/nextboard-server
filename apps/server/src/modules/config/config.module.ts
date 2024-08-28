import process from 'node:process'
import { Global, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppConfigService } from './config.service'
import { validateConfigs } from './utils/validateConfigs'

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
      validate: validateConfigs,
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
