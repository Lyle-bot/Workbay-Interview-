import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { JobZone } from './entities/job.entity';
import { JobZoneController } from './jobs.controller';
import { JobZoneService } from './jobs.service';

@Module({
  imports: [TypeOrmModule.forFeature([JobZone])],
  controllers: [JobZoneController],
  providers: [JobZoneService],
})
export class JobsModule {}
