import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class SubmitReimbursementResponseDto {
  @ApiProperty({ 
    description: 'Unique identifier for the reimbursement record',
    example: '123e4567-e89b-12d3-a456-426614174000' 
  })
  id: string;

  @ApiProperty({ 
    description: 'Unique identifier of the employee who submitted the reimbursement',
    example: '123e4567-e89b-12d3-a456-426614174000' 
  })
  employee_id: string;

  @ApiProperty({ 
    description: 'Date when the reimbursement was submitted (YYYY-MM-DD format)',
    example: '2024-01-15' 
  })
  @Transform(({ value }) => value instanceof Date ? value.toISOString().split('T')[0] : value)
  reimbursement_date: Date;

  @ApiProperty({ 
    description: 'Amount requested for reimbursement',
    example: 50000,
    minimum: 1 
  })
  amount: number;

  @ApiProperty({ 
    description: 'Purpose or explanation for the reimbursement request',
    example: 'Taxi fare for client meeting' 
  })
  description: string;
}
