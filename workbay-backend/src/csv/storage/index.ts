// src/csv/storage/index.ts
import { localStorageConfig } from './local.storage';

// Swap this out when ready for S3
// export { s3StorageConfig as uploadStorage } from './s3.storage';
export { localStorageConfig as uploadStorage };
