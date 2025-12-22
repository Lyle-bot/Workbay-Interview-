import {
  Controller,
  Patch,
  Param,
  Body,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { JobZoneService } from './jobs.service';
import { UpdateJobZoneDto } from './dto/update-job.dto';

@Controller('job-zone')
export class JobZoneController {
  constructor(private readonly jobZoneService: JobZoneService) {}

  @Patch(':id')
  @ApiOperation({ summary: 'Update job zone date and domain source' })
  @ApiParam({ name: 'id', description: 'Job zone ID' })
  @ApiResponse({ status: 200, description: 'Job zone updated successfully' })
  @ApiResponse({ status: 404, description: 'Job zone not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateJobZoneDto: UpdateJobZoneDto,
  ) {
    return this.jobZoneService.update(id, updateJobZoneDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete job zone by ID' })
  @ApiParam({ name: 'id', description: 'Job zone ID' })
  @ApiResponse({ status: 200, description: 'Job zone deleted successfully' })
  @ApiResponse({ status: 404, description: 'Job zone not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.jobZoneService.remove(id);
  }
}
