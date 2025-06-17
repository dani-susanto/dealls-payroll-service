import { ApiProperty } from '@nestjs/swagger';
import { PayrollPeriodStatus } from '../../entities/payroll-period.entity';

class PayrollPeriodDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  start_date: Date;

  @ApiProperty()
  end_date: Date;

  @ApiProperty({ enum: PayrollPeriodStatus })
  status: PayrollPeriodStatus;

  @ApiProperty()
  eligible_employee_count: number;

  @ApiProperty()
  processed_employee_count: number;

  @ApiProperty()
  failed_employee_count: number;
}

export class ListPayrollPeriodsResponseDto {
  @ApiProperty({ type: [PayrollPeriodDto] })
  data: PayrollPeriodDto[];

  @ApiProperty()
  meta: {
    total: number;
    page: number;
    limit: number;
    last_page: number;
  };
}
