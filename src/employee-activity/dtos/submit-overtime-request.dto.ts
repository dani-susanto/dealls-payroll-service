import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Max, Min } from 'class-validator';

export class SubmitOvertimeRequestDto {
  @ApiProperty({ 
    example: 2, 
    description: 'Number of overtime hours (1-3)' 
  })
  @IsInt()
  @Min(1)
  @Max(3)
  extra_hour: number;
}
