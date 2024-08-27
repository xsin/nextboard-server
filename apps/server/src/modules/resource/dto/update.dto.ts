import { PartialType } from '@nestjs/swagger'
import { CreateResourceDto } from './create.dto'

export class UpdateResourceDto extends PartialType(CreateResourceDto) {}
