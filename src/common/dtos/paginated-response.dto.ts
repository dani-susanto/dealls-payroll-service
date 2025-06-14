import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from './pagination-meta.dto';

export class PaginatedResponseDto<T> {
  @ApiProperty({ 
    description: 'The actual data content of the response'
  })
  data: T;

  @ApiProperty({ 
    description: 'Pagination metadata containing total count, current page, and other pagination details',
    type: PaginationMetaDto 
  })
  meta: PaginationMetaDto;
}
