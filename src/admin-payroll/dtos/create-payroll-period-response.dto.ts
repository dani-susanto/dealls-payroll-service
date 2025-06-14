import { ApiProperty } from '@nestjs/swagger';
import { PayrollPeriodStatus } from '../../entities/payroll-period.entity';
import { Transform } from 'class-transformer';

export class CreatePayrollPeriodResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the payroll period',
    example: '4232cafd-9a13-4fc3-aea5-37b332d5a8cf'
  })
  id: string;

  @ApiProperty({
    description: 'Start date of the payroll period in YYYY-MM-DD format',
    example: '2024-01-01'
  })
  @Transform(({ value }) => value instanceof Date ? value.toISOString().split('T')[0] : value)
  start_date: Date;

  @ApiProperty({
    description: 'End date of the payroll period in YYYY-MM-DD format',
    example: '2024-01-31'
  })
  @Transform(({ value }) => value instanceof Date ? value.toISOString().split('T')[0] : value)
  end_date: Date;

  @ApiProperty({
    description: 'Current status of the payroll period',
    enum: PayrollPeriodStatus,
    example: PayrollPeriodStatus.DRAFT
  })
  status: PayrollPeriodStatus;

  @ApiProperty({
    description: 'Timestamp when the payroll period was created',
    example: '2024-01-01T00:00:00Z'
  })
  created_at: Date;

  @ApiProperty({
    description: 'Timestamp when the payroll period was last updated',
    example: '2024-01-01T00:00:00Z'
  })
  updated_at: Date;
}
