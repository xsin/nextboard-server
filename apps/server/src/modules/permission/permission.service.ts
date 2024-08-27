import { Injectable } from '@nestjs/common'
import { CreatePermissionDto } from './dto/create.dto'
import { UpdatePermissionDto } from './dto/update.dto'

@Injectable()
export class PermissionService {
  create(_createPermissionDto: CreatePermissionDto) {
    return 'This action adds a new permission'
  }

  findAll() {
    return `This action returns all permission`
  }

  findOne(id: string) {
    return `This action returns a #${id} permission`
  }

  update(id: string, _updatePermissionDto: UpdatePermissionDto) {
    return `This action updates a #${id} permission`
  }

  remove(id: string) {
    return `This action removes a #${id} permission`
  }
}
