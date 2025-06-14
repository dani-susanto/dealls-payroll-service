import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDto {
  @ApiProperty({
    description: 'Total number of records available',
    example: 100
  })
  total: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
    minimum: 1
  })
  page: number;

  @ApiProperty({
    description: 'Total number of pages available',
    example: 10
  })
  last_page: number;

  @ApiProperty({
    description: 'Number of records per page',
    example: 10,
    minimum: 1
  })
  limit: number;
}
