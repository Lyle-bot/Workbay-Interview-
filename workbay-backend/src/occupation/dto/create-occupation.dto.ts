import { IsString, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOccupationDto {
  @ApiProperty({
    description: 'O*NET-SOC occupation code',
    example: '11-1011.00',
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  onetSocCode: string;

  @ApiProperty({
    description: 'Occupation title',
    example: 'Chief Executives',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  title: string;

  @ApiProperty({
    description: 'Occupation description',
    example:
      'Determine and formulate policies and provide overall direction of companies or private and public sector organizations...',
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}
