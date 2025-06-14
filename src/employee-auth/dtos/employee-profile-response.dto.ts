import { ApiProperty } from '@nestjs/swagger';

export class EmployeeProfileResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the employee',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  id: string;

  @ApiProperty({
    description: 'Full name of the employee',
    example: 'John Doe'
  })
  name: string;

  @ApiProperty({
    description: 'Unique username for login',
    example: 'john.doe'
  })
  username: string;

  @ApiProperty({
    name: 'basic_salary_amount',
    description: 'Employee basic salary amount',
    example: 5000000
  })
  basic_salary_amount: number;

  constructor(partial: Partial<EmployeeProfileResponseDto>) {
    Object.assign(this, partial);
  }
}
