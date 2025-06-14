import { ApiProperty } from '@nestjs/swagger';
import { PayrollPeriodStatus } from '../../entities/payroll-period.entity';

export class ExecutePayrollPeriodResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the payroll period',
    example: '4232cafd-9a13-4fc3-aea5-37b332d5a8cf'
  })
  id: string;

  @ApiProperty({
    description: 'Current status of the payroll period after execution',
    enum: PayrollPeriodStatus,
    example: PayrollPeriodStatus.COMPLETED
  })
  status: PayrollPeriodStatus;
}
