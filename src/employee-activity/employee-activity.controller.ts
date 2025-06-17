import { Body, Controller, Post, Request, UseGuards, SerializeOptions } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { EmployeeActivityService } from './employee-activity.service';
import { SubmitAttendanceResponseDto } from './dtos/submit-attendance-response.dto';
import { SubmitOvertimeRequestDto } from './dtos/submit-overtime-request.dto';
import { SubmitOvertimeResponseDto } from './dtos/submit-overtime-response.dto';
import { SubmitReimbursementRequestDto } from './dtos/submit-reimbursement-request.dto';
import { SubmitReimbursementResponseDto } from './dtos/submit-reimbursement-response.dto';
import { JwtEmployeeActiveAuthGuard } from '../common/guards/jwt-employee-active-auth.guard';

@ApiTags('Employee Activity')
@Controller({
  path: 'employee/activity',
  version: '1'
})
@ApiBearerAuth('employee-access-token')
@UseGuards(JwtEmployeeActiveAuthGuard)
export class EmployeeActivityController {
  constructor(private employeeActivityService: EmployeeActivityService) {}

  @ApiOperation({ summary: 'Submit attendance for today' })
  @ApiResponse({ 
    status: 201, 
    description: 'Attendance submitted successfully',
    type: SubmitAttendanceResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Weekend or already submitted today' })
  @Post('attendance')
  @SerializeOptions({ type: SubmitAttendanceResponseDto })
  submitAttendance(@Request() req): Promise<SubmitAttendanceResponseDto> {
    return this.employeeActivityService.submitAttendance(req.user.sub);
  }

  @ApiOperation({ summary: 'Submit overtime hours' })
  @ApiResponse({ 
    status: 201, 
    description: 'Overtime submitted successfully',
    type: SubmitOvertimeResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Invalid hours or submission time' })
  @Post('overtime')
  @SerializeOptions({ type: SubmitOvertimeResponseDto })
  submitOvertime(
    @Request() req,
    @Body() dto: SubmitOvertimeRequestDto
  ): Promise<SubmitOvertimeResponseDto> {
    return this.employeeActivityService.submitOvertime(req.user.sub, dto.extra_hour);
  }

  @ApiOperation({ summary: 'Submit reimbursement request' })
  @ApiResponse({ 
    status: 201, 
    description: 'Reimbursement submitted successfully',
    type: SubmitReimbursementResponseDto 
  })
  @Post('reimbursement')
  @SerializeOptions({ type: SubmitReimbursementResponseDto })
  submitReimbursement(
    @Request() req,
    @Body() dto: SubmitReimbursementRequestDto
  ): Promise<SubmitReimbursementResponseDto> {
    return this.employeeActivityService.submitReimbursement(
      req.user.sub,
      dto.amount,
      dto.description
    );
  }
}
