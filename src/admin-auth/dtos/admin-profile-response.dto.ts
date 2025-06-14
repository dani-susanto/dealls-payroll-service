import { ApiProperty } from '@nestjs/swagger';

export class AdminProfileResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the admin',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  id: string;

  @ApiProperty({
    description: 'Full name of the admin',
    example: 'Admin User'
  })
  name: string;

  @ApiProperty({
    description: 'Unique username for login',
    example: 'admin.user'
  })
  username: string;

  constructor(partial: Partial<AdminProfileResponseDto>) {
    Object.assign(this, partial);
  }
}
