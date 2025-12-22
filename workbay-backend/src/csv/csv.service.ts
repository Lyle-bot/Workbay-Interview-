import { Injectable } from '@nestjs/common';

import { IMPORTABLE_ENTITIES } from './allowed-entities';

@Injectable()
export class CsvService {
  getAvailableEntities() {
    return Object.keys(IMPORTABLE_ENTITIES);
  }

  findAll() {
    return `This action returns all csv metadata`;
  }

  findOne(id: number) {
    return `This action returns meta data of #${id} csv`;
  }

  remove(id: number) {
    return `This action removes a #${id} csv`;
  }
}
