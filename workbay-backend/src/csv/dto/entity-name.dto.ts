// src/csv/dto/entity-name.dto.ts
import { IsIn } from 'class-validator';

import * as allowedEntities from '../allowed-entities';

const validEntityNames = Object.keys(
  allowedEntities.IMPORTABLE_ENTITIES,
) as allowedEntities.ImportableEntityName[];

export class EntityNameDto {
  @IsIn(validEntityNames, {
    message: `entityName must be one of: ${validEntityNames.join(', ')}`,
  })
  entityName: allowedEntities.ImportableEntityName;
}
