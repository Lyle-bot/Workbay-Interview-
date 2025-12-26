import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  Header,
  StreamableFile,
} from '@nestjs/common';
import { CsvService } from './csv.service';

import { FileInterceptor } from '@nestjs/platform-express';
import { CsvFileValidator } from '../csv/file-validation/file-type-csv-validation.pipe';
import type { Express } from 'express';

import { UploadCsvService } from './upload.service';
import { uploadStorage } from './storage';
import { EntityNameDto } from './dto/entity-name.dto';
import * as allowedEntities from './allowed-entities';
import { DownloadCsvService } from './download.service';

@Controller('csv')
export class CsvController {
  constructor(
    private readonly csvService: CsvService,
    private readonly uploadCsvService: UploadCsvService,
    private readonly downloadCsvService: DownloadCsvService,
  ) {}

  @Get('entities')
  getAvailableEntities() {
    return this.csvService.getAvailableEntities();
  }

  // src/csv/csv.controller.ts
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: uploadStorage,
    }),
  )
  async uploadCsv(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new CsvFileValidator(),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() dto: EntityNameDto,
  ) {
    return this.uploadCsvService.importCsv(
      dto.entityName,
      file.path,
      file.originalname,
    );
  }

  @Get('download/:entityName')
  @Header('Content-Type', 'text/csv')
  async downloadCsv(
    @Param('entityName') entityName: allowedEntities.ImportableEntityName,
  ): Promise<StreamableFile> {
    const { filename, content } =
      await this.downloadCsvService.exportCsv(entityName);

    const buffer = Buffer.from(content, 'utf-8');

    return new StreamableFile(buffer, {
      disposition: `attachment; filename="${filename}"`,
    });
  }
}
