import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PayrollPeriod, PayrollPeriodStatus } from '../entities/payroll-period.entity';
import { PayrollSummary } from '../entities/payroll-summary.entity';
import { EmployeeAttendance } from '../entities/employee-attendance.entity';
import { EmployeeOvertime } from '../entities/employee-overtime.entity';
import { PayslipResponseDto } from './dtos/payslip-response.dto';

@Injectable()
export class EmployeePayrollService {
  constructor(
    @InjectRepository(PayrollPeriod)
    private payrollPeriodRepository: Repository<PayrollPeriod>,
    @InjectRepository(PayrollSummary)
    private payrollSummaryRepository: Repository<PayrollSummary>,
  ) {}

  async getLatestPayslip(employeeId: string): Promise<PayslipResponseDto> {
    const latestPeriod = await this.payrollPeriodRepository.findOne({
      where: { status: PayrollPeriodStatus.COMPLETED },
      order: { end_date: 'DESC' }
    });

    if (!latestPeriod) throw new NotFoundException('No completed payroll periods found');

    const summary = await this.payrollSummaryRepository.findOne({
      where: {
        employee_id: employeeId,
        payroll_period_id: latestPeriod.id
      },
      relations: ['components']
    });

    if (!summary) throw new NotFoundException('No payslip found for the latest period');
  

    const attendanceCount = await this.payrollSummaryRepository
      .createQueryBuilder('summary')
      .leftJoin(EmployeeAttendance, 'attendance', 'attendance.employee_id = summary.employee_id')
      .where('attendance.attendance_date BETWEEN :start AND :end', {
        start: latestPeriod.start_date,
        end: latestPeriod.end_date
      })
      .getCount();

    const overtimeHours = await this.payrollSummaryRepository
      .createQueryBuilder('summary')
      .leftJoin(EmployeeOvertime, 'overtime', 'overtime.employee_id = summary.employee_id')
      .where('overtime.overtime_date BETWEEN :start AND :end', {
        start: latestPeriod.start_date,
        end: latestPeriod.end_date
      })
      .select('SUM(overtime.extra_hour)', 'total')
      .getRawOne();

    return {
      start_date: latestPeriod.start_date,
      end_date: latestPeriod.end_date,
      attendance_count: attendanceCount,
      overtime_hours: Number(overtimeHours?.total || 0),
      components: summary.components.map(c => ({
        ...c,
        amount: Number(c.amount || 0)
      })),
      take_home_pay_amount: Number(summary.take_home_pay_amount || 0)
    };
  }
}
