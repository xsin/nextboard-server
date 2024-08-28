import { PartialType } from '@nestjs/swagger'
import { CreateDictDto } from './create.dto'

export class UpdateDictDto extends PartialType(CreateDictDto) {}
