import { Module } from '@nestjs/common';
import { CsvService } from './csv.service';
import { CsvController } from './csv.controller';
import { DownloadCsvService } from './download.service';
import { UploadCsvService } from './upload.service';
import { CsvConfigValidatorService } from './csv-config-validator.service';
import { CsvUpload } from './entities/csv.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CsvUpload])],
  controllers: [CsvController],
  providers: [
    CsvService,
    DownloadCsvService,
    UploadCsvService,
    CsvConfigValidatorService,
  ],
})
export class CsvModule {}
