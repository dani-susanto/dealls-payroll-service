import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class CreatePayrollPeriodRequestDto {
  @ApiProperty({ 
    description: 'Start date of the payroll period in YYYY-MM-DD format',
    example: '2024-01-01' 
  })
  @IsNotEmpty()
  @IsDateString()
  start_date: Date;

  @ApiProperty({ 
    description: 'End date of the payroll period in YYYY-MM-DD format',
    example: '2024-01-31' 
  })
  @IsNotEmpty()
  @IsDateString()
  end_date: Date;
}
