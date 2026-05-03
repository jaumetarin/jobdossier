import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetOffersQueryDto {
  @ApiPropertyOptional({
    example: '1',
    description: 'Page number',
  })
  page?: string;

  @ApiPropertyOptional({
    example: '20',
    description: 'Number of offers per page',
  })
  limit?: string;

  @ApiPropertyOptional({
    example: 'Madrid',
    description: 'Filter offers by location',
  })
  location?: string;

  @ApiPropertyOptional({
    example: 'remote',
    description: 'Filter offers by work modality',
  })
  modality?: string;

  @ApiPropertyOptional({
    example: 'react',
    description: 'Filter by normalized technology',
  })
  technology?: string;

  @ApiPropertyOptional({
    example: 'frontend',
    description: 'Free text search across job content',
  })
  search?: string;
}
