import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, DataSource, EntityManager } from 'typeorm';
import { PayrollPeriod, PayrollPeriodStatus } from '../entities/payroll-period.entity';
import { CreatePayrollPeriodRequestDto } from './dtos/create-payroll-period-request.dto';
import { PayrollSummary } from '../entities/payroll-summary.entity';
import { PayrollSummaryComponent, PayrollSummaryComponentPaymentType } from '../entities/payroll-summary-component.entity';
import { EmployeeAttendance } from '../entities/employee-attendance.entity';
import { EmployeeOvertime } from '../entities/employee-overtime.entity';
import { EmployeeReimbursement } from '../entities/employee-reimbursement.entity';
import { Employee } from '../entities/employee.entity';
import { ExecutePayrollPeriodResponseDto } from './dtos/execute-payroll-period-response.dto';
import { PaginationQueryDto } from '../common/dtos/pagination-query.dto';
import { PayrollPeriodSummaryResponseDto } from './dtos/payroll-period-summary-response.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class AdminPayrollService {
  constructor(
    @InjectQueue('init-process-employee-payroll')
    private payrollInitQueue: Queue,
    private dataSource: DataSource,
    @InjectRepository(PayrollPeriod)
    private payrollPeriodRepository: Repository<PayrollPeriod>,
    @InjectRepository(PayrollSummary)
    private payrollSummaryRepository: Repository<PayrollSummary>,
    @InjectRepository(PayrollSummaryComponent)
    private payrollSummaryComponentRepository: Repository<PayrollSummaryComponent>,
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(EmployeeAttendance)
    private employeeAttendanceRepository: Repository<EmployeeAttendance>,
    @InjectRepository(EmployeeOvertime)
    private employeeOvertimeRepository: Repository<EmployeeOvertime>,
    @InjectRepository(EmployeeReimbursement)
    private employeeReimbursementRepository: Repository<EmployeeReimbursement>,
  ) {}
  
  async createPayrollPeriod(dto: CreatePayrollPeriodRequestDto): Promise<PayrollPeriod> {
    const startDate = new Date(dto.start_date);
    const endDate = new Date(dto.end_date);
    
    if (startDate >= endDate) throw new BadRequestException('End date must be after start date');

    const overlappingPeriod = await this.payrollPeriodRepository.findOne({
      where: [
        {
          start_date: Between(startDate, endDate),
        },
        {
          end_date: Between(startDate, endDate),
        },
      ],
    });
    
    if (overlappingPeriod) throw new BadRequestException('Date range overlaps with existing payroll period');
    
    const payrollPeriod = this.payrollPeriodRepository.create({
      start_date: startDate,
      end_date: endDate,
      status: PayrollPeriodStatus.DRAFT,
    });
    
    return this.payrollPeriodRepository.save(payrollPeriod);
  }

  async executePayroll(periodId: string, adminId: string): Promise<ExecutePayrollPeriodResponseDto> {
    await this.validateAndUpdatePeriod(periodId);

    await this.payrollInitQueue.add('init-process-employee-payroll', { periodId, adminId });

    return {
      id: periodId,
      status: PayrollPeriodStatus.PROCESSING
    };
  }
  
  private async validateAndUpdatePeriod(periodId: string): Promise<PayrollPeriod> {
    const period = await this.payrollPeriodRepository.findOneBy({ id: periodId });
    
    if (!period) throw new NotFoundException('Payroll period not found');
    
    if (period.status !== PayrollPeriodStatus.DRAFT) throw new BadRequestException('Payroll period is not in draft status');
    
    period.status = PayrollPeriodStatus.PROCESSING;
    return this.payrollPeriodRepository.save(period);
  }

  public calculateWorkingDays(startDate: Date, endDate: Date): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let count = 0;
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const day = d.getDay();
      if (day !== 0 && day !== 6) count++; 
    }
    
    return count || 1; 
  }

  async getEligibleEmployees(period: PayrollPeriod): Promise<Employee[]> {
    return this.dataSource
      .createQueryBuilder(Employee, 'employee')
      .where('employee.status = :status', { status: 'ACTIVE' })
      .andWhere((qb) => {
        const subQuery = qb
        .subQuery()
        .select('1')
        .from(EmployeeAttendance, 'attendance')
        .where('attendance.employee_id = employee.id')
        .andWhere('attendance.attendance_date BETWEEN :startDate AND :endDate')
        .getQuery();
        return `EXISTS ${subQuery}`;
      })
      .orWhere((qb) => {
        const subQuery = qb
        .subQuery()
        .select('1')
        .from(EmployeeOvertime, 'overtime')
        .where('overtime.employee_id = employee.id')
        .andWhere('overtime.overtime_date BETWEEN :startDate AND :endDate')
        .getQuery();
        return `EXISTS ${subQuery}`;
      })
      .orWhere((qb) => {
        const subQuery = qb
        .subQuery()
        .select('1')
        .from(EmployeeReimbursement, 'reimbursement')
        .where('reimbursement.employee_id = employee.id')
        .andWhere('reimbursement.reimbursement_date BETWEEN :startDate AND :endDate')
        .getQuery();
        return `EXISTS ${subQuery}`;
      })
      .leftJoinAndSelect('employee.attendances', 'attendance',
        'attendance.attendance_date BETWEEN :startDate AND :endDate'
      )
      .leftJoinAndSelect('employee.overtimes', 'overtime',
        'overtime.overtime_date BETWEEN :startDate AND :endDate'
      )
      .leftJoinAndSelect('employee.reimbursements', 'reimbursement',
        'reimbursement.reimbursement_date BETWEEN :startDate AND :endDate'
      )
      .setParameters({
        startDate: period.start_date,
        endDate: period.end_date
      })
      .getMany();
  }

  calculateDailySalary(basicSalary: number, workingDays: number): number {
    return Number((basicSalary / workingDays).toFixed(2));
  }

  calculateAttendanceAmount(dailySalary: number, attendanceCount: number): number {
    return Number((dailySalary * attendanceCount).toFixed(2));
  }

  calculateOvertimeAmount(basicSalary: number, workingDays: number, overtimes: EmployeeOvertime[]): number {
    const hourlyRate = Number((basicSalary / (workingDays * 8)).toFixed(2));
    return Number(
      overtimes.reduce((sum, ot) => sum + (ot.extra_hour * hourlyRate * 2), 0).toFixed(2)
    );
  }

  calculateReimbursementAmount(reimbursements: EmployeeReimbursement[]): number {
    return Number(
      reimbursements.reduce((sum, reim) => sum + Number(reim.amount), 0).toFixed(2)
    );
  }

  async createPayrollSummaryWithComponents(
    manager: EntityManager,
    periodId: string,
    employeeId: string,
    totalAmount: number,
    amounts: { attendanceAmount: number; overtimeAmount: number; reimbursementAmount: number }
  ) {
    const summary = manager.create(PayrollSummary, {
      payroll_period_id: periodId,
      employee_id: employeeId,
      take_home_pay_amount: totalAmount
    });

    const savedSummary = await manager.save(summary);

    const components = [
      manager.create(PayrollSummaryComponent, {
        payroll_summary_id: savedSummary.id,
        payment_type: PayrollSummaryComponentPaymentType.SALARY,
        amount: amounts.attendanceAmount
      }),
      manager.create(PayrollSummaryComponent, {
        payroll_summary_id: savedSummary.id,
        payment_type: PayrollSummaryComponentPaymentType.OVERTIME,
        amount: amounts.overtimeAmount
      }),
      manager.create(PayrollSummaryComponent, {
        payroll_summary_id: savedSummary.id,
        payment_type: PayrollSummaryComponentPaymentType.REIMBURSEMENT,
        amount: amounts.reimbursementAmount
      })
    ];

    await manager.save(components);
  }

  private async updatePeriodCounts(period: PayrollPeriod, eligibleCount: number, processedCount: number, failedCount: number, manager: EntityManager) {
    period.status = PayrollPeriodStatus.COMPLETED;
    period.eligible_employee_count = eligibleCount;
    period.processed_employee_count = processedCount;
    period.failed_employee_count = failedCount;
    await manager.save(period);
  }

  async getPeriodSummaries(periodId: string, query: PaginationQueryDto): Promise<PayrollPeriodSummaryResponseDto> {
    const period = await this.payrollPeriodRepository.findOneBy({ id: periodId });
    
    if (!period) throw new NotFoundException('Payroll period not found');

    const page = Number(query.page || 1);
    const limit = Number(query.limit || 10);
    const skip = (page - 1) * limit;

    const [summaries, total] = await this.payrollSummaryRepository
      .createQueryBuilder('summary')
      .leftJoin('summary.employee', 'employee')
      .select([
        'summary.id',
        'summary.take_home_pay_amount',
        'employee.id',
        'employee.name'
      ])
      .where('summary.payroll_period_id = :periodId', { periodId })
      .orderBy('employee.name', 'ASC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const totalAmount = await this.payrollSummaryRepository
      .createQueryBuilder('summary')
      .where('summary.payroll_period_id = :periodId', { periodId })
      .select('SUM(summary.take_home_pay_amount)', 'total')
      .getRawOne();

    return {
      id: period.id,
      start_date: period.start_date,
      end_date: period.end_date,
      status: period.status,
      total_take_home_pay: Number(totalAmount?.total || 0),
      summaries: summaries.map(summary => ({
        id: summary.employee.id,
        name: summary.employee.name,
        take_home_pay_amount: Number(summary.take_home_pay_amount || 0)
      })),
      meta: {
        total,
        page,
        limit,
        last_page: Math.ceil(total / limit)
      }
    };
  }
}
