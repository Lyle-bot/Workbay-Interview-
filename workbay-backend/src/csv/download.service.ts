// src/csv/download.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { stringify } from 'csv-stringify/sync';
import {
  IMPORTABLE_ENTITIES,
  ImportableEntityName,
  getEntity,
} from './allowed-entities';

function toStringValue(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean')
    return String(value);
  if (value instanceof Date) return value.toISOString();
  return JSON.stringify(value);
}

@Injectable()
export class DownloadCsvService {
  constructor(private readonly dataSource: DataSource) {}

  async exportCsv(entityName: ImportableEntityName): Promise<{
    filename: string;
    content: string;
  }> {
    if (!(entityName in IMPORTABLE_ENTITIES)) {
      throw new BadRequestException(
        `Entity '${entityName}' not found or not allowed for CSV export.`,
      );
    }

    const entity = getEntity(entityName);
    const { headers } = IMPORTABLE_ENTITIES[entityName];

    const repository = this.dataSource.getRepository(entity);
    const records = await repository.find();

    if (!records.length) {
      throw new BadRequestException(`No data found for ${entityName}.`);
    }

    const csvRows: Record<string, string>[] = records.map((record) => {
      const row: Record<string, string> = {};
      const recordObj = record as unknown as Record<string, unknown>;

      for (const [field, header] of Object.entries(headers)) {
        row[header] = toStringValue(recordObj[field]);
      }

      return row;
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const csvContent = stringify(csvRows, {
      header: true,
      columns: Object.values(headers).map(String),
    }) as string;

    const filename = `${entityName}-${Date.now()}.csv`;

    return {
      filename,
      content: csvContent,
    };
  }
}
