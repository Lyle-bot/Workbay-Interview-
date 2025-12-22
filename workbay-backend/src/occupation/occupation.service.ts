import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateOccupationDto } from './dto/create-occupation.dto';
import { Repository } from 'typeorm';
import { Occupation } from './entities/occupation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JobZone } from 'src/jobs/entities/job.entity';

@Injectable()
export class OccupationService {
  constructor(
    @InjectRepository(Occupation)
    private occupationRepository: Repository<Occupation>,
  ) {}

  async create(createOccupationDto: CreateOccupationDto): Promise<Occupation> {
    // Check if occupation with this SOC code already exists
    const existing = await this.occupationRepository.findOne({
      where: { onetSocCode: createOccupationDto.onetSocCode },
    });

    if (existing) {
      throw new ConflictException(
        `Occupation with SOC code ${createOccupationDto.onetSocCode} already exists`,
      );
    }

    // Create new occupation
    const occupation = this.occupationRepository.create(createOccupationDto);

    // Save and return
    return await this.occupationRepository.save(occupation);
  }

  async findBySocCode(socCode: string): Promise<Occupation> {
    const occupation = await this.occupationRepository
      .createQueryBuilder('occupation')
      .leftJoinAndMapOne(
        'occupation.jobZone',
        JobZone,
        'jobZone',
        'occupation.onet_soc_code = jobZone.onet_soc_code',
      )
      .where('occupation.onet_soc_code = :socCode', { socCode })
      .getOne();

    if (!occupation) {
      throw new NotFoundException(
        `Occupation with SOC code ${socCode} not found`,
      );
    }

    return occupation;
  }
}
