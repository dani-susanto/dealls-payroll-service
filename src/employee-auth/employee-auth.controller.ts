import { Body, Controller, Get, Post, Request, SerializeOptions, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthLoginRequestDto } from '../common/dtos/auth-login-request.dto';
import { AuthResponseDto } from '../common/dtos/auth-response.dto';
import { EmployeeProfileResponseDto } from './dtos/employee-profile-response.dto';
import { EmployeeAuthService } from './employee-auth.service';
import { JwtEmployeeAuthGuard } from '../common/guards/jwt-employee-auth.guard';

@ApiTags('Employee Authentication')
@Controller({
  path: 'employee/auth',
  version: '1'
})
@SerializeOptions({ type: AuthResponseDto })
export class EmployeeAuthController {
  constructor(private employeeAuthService: EmployeeAuthService) {}
  
  @ApiOperation({ summary: 'Employee login' })
  @ApiResponse({
    status: 200, 
    description: 'Login successful', 
    type: AuthResponseDto 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Invalid credentials' 
  })
  @Post('login')
  async login(@Body() body: AuthLoginRequestDto): Promise<AuthResponseDto> {
    return this.employeeAuthService.login(body.username, body.password);
  }
  
  @ApiOperation({ summary: 'Get employee profile' })
  @ApiResponse({ 
    status: 200, 
    description: 'Profile retrieved successfully', 
    type: EmployeeProfileResponseDto 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized' 
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtEmployeeAuthGuard)
  @Get('me')
  me(@Request() req): Promise<EmployeeProfileResponseDto> {
    return this.employeeAuthService.getProfile(req.user.sub);
  }
}
