import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFilterDto {
  @ApiPropertyOptional({
    example: 'react',
    description: 'Keyword to match against job offers',
  })
  keyword?: string;

  @ApiPropertyOptional({
    example: 'Madrid',
    description: 'Preferred job location',
  })
  location?: string;

  @ApiPropertyOptional({
    example: 'remote',
    description: 'Preferred work modality',
  })
  modality?: string;
}
