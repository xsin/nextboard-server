import { PartialType } from '@nestjs/swagger';
import { CreatePermissionDto } from './create.dto';

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {}
