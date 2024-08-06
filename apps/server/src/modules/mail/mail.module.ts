import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MailController } from './mail.controller';

@Module({
  imports: [
    ConfigModule,
  ],
  controllers: [MailController],
})
export class MailModule {}
