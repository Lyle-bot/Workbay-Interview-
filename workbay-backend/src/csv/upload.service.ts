// src/csv/upload.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { parse } from 'csv-parse/sync';
import { readFileSync } from 'fs';

import {
  IMPORTABLE_ENTITIES,
  ImportableEntityName,
  getEntity,
  getExpectedHeaders,
  getHeaderToFieldMap,
} from './allowed-entities';
import { CsvUpload } from './entities/csv.entity';

@Injectable()
export class UploadCsvService {
  constructor(private readonly dataSource: DataSource) {}

  async importCsv(
    entityName: ImportableEntityName,
    filePath: string,
    originalFilename: string,
  ) {
    const csvUploadRepo = this.dataSource.getRepository(CsvUpload);

    // Create upload record
    const csvUpload = csvUploadRepo.create({
      filename: originalFilename,
      path: filePath,
      modelName: entityName,
      status: 'pending',
    });
    await csvUploadRepo.save(csvUpload);

    try {
      if (!(entityName in IMPORTABLE_ENTITIES)) {
        throw new BadRequestException(
          `Entity '${entityName}' not found or not allowed for CSV import.`,
        );
      }

      const entity = getEntity(entityName);
      const expectedHeaders = getExpectedHeaders(entityName);
      const headerToField = getHeaderToFieldMap(entityName);

      // Read file from disk
      let fileContent: string;
      try {
        fileContent = readFileSync(filePath, 'utf8');
      } catch (err: any) {
        throw new BadRequestException(`Failed to read uploaded file: ${err}`);
      }

      // Parse CSV
      const records: Record<string, string>[] = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      });

      if (!records.length) {
        throw new BadRequestException('CSV file is empty.');
      }

      // Validate headers
      const receivedHeaders = Object.keys(records[0]);
      const missingHeaders = expectedHeaders.filter(
        (h) => !receivedHeaders.includes(h),
      );
      const extraHeaders = receivedHeaders.filter(
        (h) => !expectedHeaders.includes(h),
      );

      if (missingHeaders.length || extraHeaders.length) {
        throw new BadRequestException(
          `CSV header mismatch for ${entityName}.\n` +
            `Expected: ${JSON.stringify(expectedHeaders)}\n` +
            `Received: ${JSON.stringify(receivedHeaders)}\n` +
            (missingHeaders.length
              ? `Missing: ${JSON.stringify(missingHeaders)}\n`
              : '') +
            (extraHeaders.length
              ? `Unexpected: ${JSON.stringify(extraHeaders)}`
              : ''),
        );
      }

      // Map CSV rows to entity fields
      const mappedRecords = records.map((row) => {
        const newRow: Record<string, any> = {};

        for (const [header, value] of Object.entries(row)) {
          const fieldName = headerToField[header];
          if (fieldName) {
            newRow[fieldName] = value;
          }
        }

        return newRow;
      });

      // Insert into database
      const repository = this.dataSource.getRepository(entity);
      await repository.insert(mappedRecords);

      // Update upload record - success
      csvUpload.status = 'success';
      csvUpload.rowsImported = mappedRecords.length;
      await csvUploadRepo.save(csvUpload);

      return {
        message: 'CSV imported successfully',
        entity: entityName,
        rowsInserted: mappedRecords.length,
        uploadId: csvUpload.id,
      };
    } catch (err: unknown) {
      // Update upload record - failed
      csvUpload.status = 'failed';
      csvUpload.errorMessage =
        err instanceof Error ? err.message : 'Unknown error';
      await csvUploadRepo.save(csvUpload);

      if (err instanceof BadRequestException) {
        throw err;
      }

      throw new BadRequestException(
        `Database insertion error: ${err instanceof Error ? err.message : 'Unknown error'}`,
      );
    }
  }
}
