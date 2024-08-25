import { PartialType } from '@nestjs/mapped-types'
import { CreateVCodeDto } from './createVCode.dto'

export class QueryVCodeDto extends PartialType(CreateVCodeDto) {}
