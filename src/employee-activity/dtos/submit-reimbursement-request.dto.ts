import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class SubmitReimbursementRequestDto {
  @ApiProperty({ 
    example: 50000, 
    description: 'Amount to be reimbursed' 
  })
  @IsInt()
  @Min(1)
  amount: number;

  @ApiProperty({ 
    example: 'Taxi fare for client meeting', 
    description: 'Reimbursement description' 
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}
