import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from '../../common/dtos/pagination-meta.dto';
import { Transform } from 'class-transformer';

export class PayrollSummaryItemDto {
  @ApiProperty({
    description: 'Unique identifier of the employee',
    example: '898d7499-6892-4c8e-9c81-53144374ae8c'
  })
  id: string;

  @ApiProperty({
    description: 'Full name of the employee',
    example: 'John Doe'
  })
  name: string;

  @ApiProperty({
    description: 'Total take-home pay amount for this employee',
    example: 5000000
  })
  take_home_pay_amount: number;
}

export class PayrollPeriodSummaryResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the payroll period',
    example: '4232cafd-9a13-4fc3-aea5-37b332d5a8cf'
  })
  id: string;

  @ApiProperty({
    description: 'Start date of the payroll period (YYYY-MM-DD)',
    example: '2024-01-01'
  })
  @Transform(({ value }) => value instanceof Date ? value.toISOString().split('T')[0] : value)
  start_date: Date;

  @ApiProperty({
    description: 'End date of the payroll period (YYYY-MM-DD)',
    example: '2024-01-31'
  })
  @Transform(({ value }) => value instanceof Date ? value.toISOString().split('T')[0] : value)
  end_date: Date;

  @ApiProperty({
    description: 'Current status of the payroll period',
    example: 'COMPLETED'
  })
  status: string;

  @ApiProperty({
    description: 'Sum of all employee take-home pay amounts',
    example: 50000000
  })
  total_take_home_pay: number;

  @ApiProperty({
    description: 'List of employee payroll summaries',
    type: [PayrollSummaryItemDto]
  })
  summaries: PayrollSummaryItemDto[];

  @ApiProperty({
    description: 'Pagination metadata'
  })
  meta: PaginationMetaDto;
}
