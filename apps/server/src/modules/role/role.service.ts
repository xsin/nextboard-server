import { Injectable } from '@nestjs/common'
import { CreateRoleDto } from './dto/create.dto'
import { UpdateRoleDto } from './dto/update.dto'

@Injectable()
export class RoleService {
  create(_createRoleDto: CreateRoleDto) {
    return 'This action adds a new role'
  }

  findAll() {
    return `This action returns all role`
  }

  findOne(id: string) {
    return `This action returns a #${id} role`
  }

  update(id: string, _updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`
  }

  remove(id: string) {
    return `This action removes a #${id} role`
  }
}
