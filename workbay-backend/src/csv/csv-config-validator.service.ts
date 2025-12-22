// src/csv/csv-config-validator.service.ts
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { IMPORTABLE_ENTITIES, ImportableEntityName } from './allowed-entities';

// DEVELOPER CHECK CODE
// This files just check to make sure that you didn't make a mistake
// when listing the entity fields to header keys

@Injectable()
export class CsvConfigValidatorService implements OnModuleInit {
  private readonly logger = new Logger(CsvConfigValidatorService.name);

  constructor(private readonly dataSource: DataSource) {}

  onModuleInit() {
    this.validateAllConfigs();
  }

  private validateAllConfigs() {
    const entityNames = Object.keys(
      IMPORTABLE_ENTITIES,
    ) as ImportableEntityName[];

    for (const entityName of entityNames) {
      this.validateEntityConfig(entityName);
    }

    this.logger.log('All CSV entity configurations validated successfully');
  }

  private validateEntityConfig(entityName: ImportableEntityName) {
    const { entity, headers } = IMPORTABLE_ENTITIES[entityName];
    const metadata = this.dataSource.getMetadata(entity);

    const entityFields = metadata.columns
      .map((col) => col.propertyName)
      .filter((name) => name !== 'id');

    const configFields = Object.keys(headers);

    // Check for fields in config that don't exist in entity
    const invalidFields = configFields.filter(
      (field) => !entityFields.includes(field),
    );

    if (invalidFields.length) {
      throw new Error(
        `CSV config error in allowed-entities.ts for "${entityName}": ` +
          `Fields [${invalidFields.join(', ')}] do not exist on entity. ` +
          `Valid fields are: [${entityFields.join(', ')}]`,
      );
    }

    // Check for entity fields missing from config (warning only)
    const missingFields = entityFields.filter(
      (field) => !configFields.includes(field),
    );

    if (missingFields.length) {
      this.logger.warn(
        `CSV config for "${entityName}" is missing fields: [${missingFields.join(', ')}]. ` +
          `These won't be imported/exported. fix in allowed-entities.ts`,
      );
    }
  }
}
