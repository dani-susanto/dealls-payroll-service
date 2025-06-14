import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class SubmitAttendanceResponseDto {
  @ApiProperty({ 
    description: 'Unique identifier for the attendance record',
    example: '123e4567-e89b-12d3-a456-426614174000' 
  })
  id: string;

  @ApiProperty({ 
    description: 'Unique identifier of the employee who submitted the attendance',
    example: '123e4567-e89b-12d3-a456-426614174000' 
  })
  employee_id: string;

  @ApiProperty({ 
    description: 'Date when the attendance was submitted (YYYY-MM-DD format)',
    example: '2024-01-01' 
  })
  @Transform(({ value }) => value instanceof Date ? value.toISOString().split('T')[0] : value)
  attendance_date: Date;
}
