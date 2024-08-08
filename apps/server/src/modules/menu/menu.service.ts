import { Injectable } from '@nestjs/common'
import { CreateMenuDto } from './dto/create-menu.dto'
import { UpdateMenuDto } from './dto/update-menu.dto'

@Injectable()
export class MenuService {
  create(_createMenuDto: CreateMenuDto) {
    return 'This action adds a new menu'
  }

  findAll() {
    return `This action returns all menu`
  }

  findOne(id: string) {
    return `This action returns a #${id} menu`
  }

  update(id: string, _updateMenuDto: UpdateMenuDto) {
    return `This action updates a #${id} menu`
  }

  remove(id: string) {
    return `This action removes a #${id} menu`
  }
}
