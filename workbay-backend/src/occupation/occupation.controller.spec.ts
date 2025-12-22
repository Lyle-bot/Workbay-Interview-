import { Test, TestingModule } from '@nestjs/testing';
import { OccupationController } from './occupation.controller';
import { OccupationService } from './occupation.service';

describe('OccupationController', () => {
  let controller: OccupationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OccupationController],
      providers: [OccupationService],
    }).compile();

    controller = module.get<OccupationController>(OccupationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
