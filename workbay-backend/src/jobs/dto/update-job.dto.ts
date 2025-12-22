import { IsString, IsNotEmpty, Length, IsOptional } from 'class-validator';

export class UpdateJobZoneDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  date?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  domainSource?: string;
}
