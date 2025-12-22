import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { OccupationService } from './occupation.service';
import { CreateOccupationDto } from './dto/create-occupation.dto';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('occupation')
export class OccupationController {
  constructor(private readonly occupationService: OccupationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new occupation' })
  @ApiResponse({ status: 201, description: 'Occupation created successfully' })
  create(@Body() createOccupationDto: CreateOccupationDto) {
    return this.occupationService.create(createOccupationDto);
  }

  @Get(':soccode')
  @ApiOperation({ summary: 'Get occupation with job zone data by SOC code' })
  @ApiParam({ name: 'soccode', example: '11-1011.00' })
  @ApiResponse({ status: 200, description: 'Occupation with job zone data' })
  @ApiResponse({ status: 404, description: 'Occupation not found' })
  async getOccupationBySocCode(@Param('soccode') socCode: string) {
    return this.occupationService.findBySocCode(socCode); // Fixed: was occupationsService
  }
}
