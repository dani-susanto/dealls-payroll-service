import { Body, Controller, Post, UseGuards, Request, SerializeOptions, Param, Query, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdminPayrollService } from './admin-payroll.service';
import { CreatePayrollPeriodRequestDto } from './dtos/create-payroll-period-request.dto';
import { JwtAdminAuthGuard } from '../common/guards/jwt-admin-auth.guard';
import { CreatePayrollPeriodResponseDto } from './dtos/create-payroll-period-response.dto';
import { ExecutePayrollPeriodResponseDto } from './dtos/execute-payroll-period-response.dto';
import { PaginationQueryDto } from '../common/dtos/pagination-query.dto';
import { PayrollPeriodSummaryResponseDto } from './dtos/payroll-period-summary-response.dto';

@ApiTags('Admin Payroll')
@Controller({
  path: 'admin/payroll',
  version: '1'
})
@ApiBearerAuth('access-token')
@UseGuards(JwtAdminAuthGuard)
export class AdminPayrollController {
  constructor(private adminPayrollService: AdminPayrollService) {}

  @ApiOperation({ summary: 'Create new payroll period' })
  @ApiResponse({ 
    status: 201, 
    description: 'Payroll period created successfully',
    type: CreatePayrollPeriodResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Invalid date range or overlapping period' })
  @Post('periods')
  createPayrollPeriod(@Body() createPayrollPeriodDto: CreatePayrollPeriodRequestDto): Promise<CreatePayrollPeriodResponseDto> {
    return this.adminPayrollService.createPayrollPeriod(createPayrollPeriodDto);
  }

  @ApiOperation({ summary: 'Execute payroll process for period' })
  @ApiResponse({ 
    status: 200, 
    description: 'Payroll execution started',
    type: ExecutePayrollPeriodResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Invalid period or already processed' })
  @Post('periods/:id/execute')
  @SerializeOptions({ type: ExecutePayrollPeriodResponseDto })
  executePayroll(@Param('id') id: string, @Request() req): Promise<ExecutePayrollPeriodResponseDto> {
    return this.adminPayrollService.executePayroll(id, req.user.sub);
  }

  @ApiOperation({ summary: 'Get payroll period summaries' })
  @ApiResponse({ 
    status: 200,
    description: 'Period summaries retrieved successfully',
    type: PayrollPeriodSummaryResponseDto 
  })
  @Get('periods/:id')
  @SerializeOptions({ type: PayrollPeriodSummaryResponseDto })
  getPeriodSummaries(
    @Param('id') id: string,
    @Query() query: PaginationQueryDto
  ): Promise<PayrollPeriodSummaryResponseDto> {
    return this.adminPayrollService.getPeriodSummaries(id, query);
  }
}
