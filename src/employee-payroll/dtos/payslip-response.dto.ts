import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { PayrollSummaryComponentPaymentType } from '../../entities/payroll-summary-component.entity';

export class PayslipComponentDto {
  @ApiProperty({ 
    description: 'Type of payment component (SALARY, OVERTIME, or REIMBURSEMENT)',
    enum: PayrollSummaryComponentPaymentType 
  })
  payment_type: PayrollSummaryComponentPaymentType;

  @ApiProperty({ 
    description: 'Amount for this payment component',
    example: 50000 
  })
  amount: number;
}

export class PayslipResponseDto {
  @ApiProperty({ 
    description: 'Start date of the payroll period (YYYY-MM-DD format)',
    example: '2024-01-01' 
  })
  @Transform(({ value }) => value instanceof Date ? value.toISOString().split('T')[0] : value)
  start_date: Date;

  @ApiProperty({ 
    description: 'End date of the payroll period (YYYY-MM-DD format)',
    example: '2024-01-31' 
  })
  @Transform(({ value }) => value instanceof Date ? value.toISOString().split('T')[0] : value)
  end_date: Date;

  @ApiProperty({ 
    description: 'Number of days the employee attended work in this period',
    example: 22 
  })
  attendance_count: number;

  @ApiProperty({ 
    description: 'Total overtime hours worked in this period',
    example: 10 
  })
  overtime_hours: number;

  @ApiProperty({ 
    description: 'Breakdown of payment components',
    type: [PayslipComponentDto] 
  })
  components: PayslipComponentDto[];

  @ApiProperty({ 
    description: 'Total amount to be received',
    example: 1500000 
  })
  take_home_pay_amount: number;
}
