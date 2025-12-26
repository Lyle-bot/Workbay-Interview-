import { Injectable } from '@nestjs/common';

import { IMPORTABLE_ENTITIES } from './allowed-entities';

@Injectable()
export class CsvService {
  getAvailableEntities() {
    return Object.keys(IMPORTABLE_ENTITIES);
  }
}
