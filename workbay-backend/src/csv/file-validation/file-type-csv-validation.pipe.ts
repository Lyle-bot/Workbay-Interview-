import { FileValidator } from '@nestjs/common';
export class CsvFileValidator extends FileValidator {
  constructor() {
    super({});
  }

  isValid(file: Express.Multer.File): boolean {
    if (!file.originalname) return false;
    return file.originalname.toLowerCase().endsWith('.csv');
  }

  buildErrorMessage(): string {
    return 'File must be a CSV';
  }
}
