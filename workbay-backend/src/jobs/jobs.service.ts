import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { JobZone } from './entities/job-zone.entity';
// import { UpdateJobZoneDto } from './dto/update-job-zone.dto';
import { JobZone } from './entities/job.entity';
import { UpdateJobZoneDto } from './dto/update-job.dto';

@Injectable()
export class JobZoneService {
  constructor(
    @InjectRepository(JobZone)
    private jobZoneRepository: Repository<JobZone>,
  ) {}

  async update(
    id: number,
    updateJobZoneDto: UpdateJobZoneDto,
  ): Promise<JobZone> {
    // Check if job zone exists
    const jobZone = await this.jobZoneRepository.findOne({ where: { id } });

    if (!jobZone) {
      throw new NotFoundException(`Job zone with ID ${id} not found`);
    }

    // Update only the allowed fields
    if (updateJobZoneDto.date !== undefined) {
      jobZone.date = updateJobZoneDto.date;
    }

    if (updateJobZoneDto.domainSource !== undefined) {
      jobZone.domainSource = updateJobZoneDto.domainSource;
    }

    // Save and return
    return await this.jobZoneRepository.save(jobZone);
  }

  async remove(id: number): Promise<{ message: string; id: number }> {
    // Check if job zone exists
    const jobZone = await this.jobZoneRepository.findOne({ where: { id } });

    if (!jobZone) {
      throw new NotFoundException(`Job zone with ID ${id} not found`);
    }

    // Delete the job zone
    await this.jobZoneRepository.remove(jobZone);

    return {
      message: `Job zone with ID ${id} deleted successfully`,
      id,
    };
  }
}
