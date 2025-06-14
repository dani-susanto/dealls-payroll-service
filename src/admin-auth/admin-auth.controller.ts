import { Body, Controller, Get, Post, Request, SerializeOptions, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthLoginRequestDto } from '../common/dtos/auth-login-request.dto';
import { AuthResponseDto } from '../common/dtos/auth-response.dto';
import { AdminAuthService } from './admin-auth.service';
import { JwtAdminAuthGuard } from '../common/guards/jwt-admin-auth.guard';
import { AdminProfileResponseDto } from './dtos/admin-profile-response.dto';

@ApiTags('Admin Authentication')
@Controller({
  path: 'admin/auth',
  version: '1'
})
export class AdminAuthController {
  constructor(private adminAuthService: AdminAuthService) {}

  @ApiOperation({ summary: 'Admin login' })
  @ApiResponse({ 
    status: 200, 
    description: 'Login successful',
    type: AuthResponseDto 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Invalid credentials' 
  })
  @SerializeOptions({ type: AuthResponseDto })
  @Post('login')
  async login(@Body() body: AuthLoginRequestDto): Promise<AuthResponseDto> {
    return this.adminAuthService.login(body.username, body.password);
  }

  @ApiOperation({ summary: 'Get admin profile' })
  @ApiResponse({ 
    status: 200, 
    description: 'Profile retrieved successfully',
    type: AdminProfileResponseDto 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized' 
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAdminAuthGuard)
  @SerializeOptions({ type: AdminProfileResponseDto })
  @Get('me')
  me(@Request() req): Promise<AdminProfileResponseDto> {
    return this.adminAuthService.getProfile(req.user.sub);
  }
}
