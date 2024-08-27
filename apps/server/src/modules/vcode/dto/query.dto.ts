import { PartialType } from '@nestjs/mapped-types'
import { CreateVCodeDto } from './create.dto'

export class QueryVCodeDto extends PartialType(CreateVCodeDto) {}
