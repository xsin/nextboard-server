import { Module } from '@nestjs/common'
import { PrismaService } from 'src/common/prisma.service'
import { AuthService } from './auth.service'

@Module({
  providers: [AuthService, PrismaService],
})
export class AuthModule {}
