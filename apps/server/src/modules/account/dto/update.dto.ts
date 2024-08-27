import { PartialType } from '@nestjs/swagger'
import { CreateAccountDto } from './create.dto'

export class UpdateAccountDto extends PartialType(CreateAccountDto) {}
