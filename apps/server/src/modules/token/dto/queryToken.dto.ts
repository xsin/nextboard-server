import { PartialType } from '@nestjs/mapped-types'
import { CreateTokenDto } from './createToken.dto'

export class QueryTokenDto extends PartialType(CreateTokenDto) {}
