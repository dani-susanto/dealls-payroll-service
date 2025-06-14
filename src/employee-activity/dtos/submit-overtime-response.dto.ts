import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class SubmitOvertimeResponseDto {
  @ApiProperty({ 
    description: 'Unique identifier for the overtime record',
    example: '123e4567-e89b-12d3-a456-426614174000' 
  })
  id: string;

  @ApiProperty({ 
    description: 'Unique identifier of the employee who submitted the overtime',
    example: '123e4567-e89b-12d3-a456-426614174000' 
  })
  employee_id: string;

  @ApiProperty({ 
    description: 'Date when the overtime was performed (YYYY-MM-DD format)',
    example: '2024-01-15' 
  })
  @Transform(({ value }) => value instanceof Date ? value.toISOString().split('T')[0] : value)
  overtime_date: Date;

  @ApiProperty({ 
    description: 'Number of extra hours worked',
    example: 2,
    minimum: 1 
  })
  extra_hour: number;
}
