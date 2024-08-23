import { PartialType } from '@nestjs/swagger'
import { CreateResourceDto } from './createResource.dto'

export class UpdateResourceDto extends PartialType(CreateResourceDto) {}
