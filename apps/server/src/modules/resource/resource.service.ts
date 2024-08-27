import { Injectable } from '@nestjs/common'
import { CreateResourceDto } from './dto/create.dto'
import { UpdateResourceDto } from './dto/update.dto'

@Injectable()
export class ResourceService {
  create(_createMenuDto: CreateResourceDto) {
    return 'This action adds a new Resource'
  }

  findAll() {
    return `This action returns all Resource`
  }

  findOne(id: string) {
    return `This action returns a #${id} Resource`
  }

  update(id: string, _updateResourceDto: UpdateResourceDto) {
    return `This action updates a #${id} Resource`
  }

  remove(id: string) {
    return `This action removes a #${id} Resource`
  }
}
