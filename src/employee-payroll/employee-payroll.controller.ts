import { Controller, Get, Request, SerializeOptions, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { EmployeePayrollService } from './employee-payroll.service';
import { PayslipResponseDto } from './dtos/payslip-response.dto';
import { JwtEmployeeActiveAuthGuard } from '../common/guards/jwt-employee-active-auth.guard';

@ApiTags('Employee Payroll')
@Controller({
  path: 'employee/payroll',
  version: '1'
})
@ApiBearerAuth('access-token')
@UseGuards(JwtEmployeeActiveAuthGuard)
@SerializeOptions({type: PayslipResponseDto})
export class EmployeePayrollController {
  constructor(private employeePayrollService: EmployeePayrollService) {}

  @ApiOperation({ summary: 'Get latest payslip' })
  @ApiResponse({
    status: 200,
    description: 'Latest payslip retrieved successfully',
    type: PayslipResponseDto
  })
  @Get('payslip')
  getLatestPayslip(@Request() req): Promise<PayslipResponseDto> {
    return this.employeePayrollService.getLatestPayslip(req.user.sub);
  }
}
