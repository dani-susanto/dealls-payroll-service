import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Employee } from '../../entities/employee.entity';
import { PayrollPeriod, PayrollPeriodStatus } from '../../entities/payroll-period.entity';
import { AdminPayrollService } from '../admin-payroll.service';

interface ProcessEmployeePayload {
  periodId: string;
  employeeId: string;
  workingDays: number;
}

@Processor('process-employee-payroll')
export class ProcessEmployeePayrollJob extends WorkerHost {
  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager,
    private adminPayrollService: AdminPayrollService
  ) {
    super();
  }

  async process(job: Job<ProcessEmployeePayload>): Promise<void> {
    const { periodId, employeeId, workingDays } = job.data;

    try {
      await this.entityManager.transaction(async manager => {
        const employee = await this.loadEmployeeData(employeeId, periodId, manager);
        if (!employee) return;

        const dailySalary = this.adminPayrollService.calculateDailySalary(employee.basic_salary_amount, workingDays);
        const attendanceAmount = this.adminPayrollService.calculateAttendanceAmount(dailySalary, employee.attendances.length);
        const overtimeAmount = this.adminPayrollService.calculateOvertimeAmount(employee.basic_salary_amount, workingDays, employee.overtimes);
        const reimbursementAmount = this.adminPayrollService.calculateReimbursementAmount(employee.reimbursements);

        const totalAmount = Number((attendanceAmount + overtimeAmount + reimbursementAmount).toFixed(2));

        await this.adminPayrollService.createPayrollSummaryWithComponents(
          manager,
          periodId,
          employeeId,
          totalAmount,
          { attendanceAmount, overtimeAmount, reimbursementAmount }
        );

        await this.updateProcessedCount(periodId, manager);
      });
    } catch (error) {
      await this.updateFailedCount(periodId, this.entityManager);
      throw error;
    }
  }

  private async loadEmployeeData(employeeId: string, periodId: string, manager: EntityManager): Promise<Employee | null> {
    const period = await manager.findOneBy(PayrollPeriod, { id: periodId });
    if (!period) return null;

    return manager
      .createQueryBuilder(Employee, 'employee')
      .leftJoinAndSelect('employee.attendances', 'attendance',
        'attendance.attendance_date BETWEEN :startDate AND :endDate',
        { startDate: period.start_date, endDate: period.end_date }
      )
      .leftJoinAndSelect('employee.overtimes', 'overtime',
        'overtime.overtime_date BETWEEN :startDate AND :endDate',
        { startDate: period.start_date, endDate: period.end_date }
      )
      .leftJoinAndSelect('employee.reimbursements', 'reimbursement',
        'reimbursement.reimbursement_date BETWEEN :startDate AND :endDate',
        { startDate: period.start_date, endDate: period.end_date }
      )
      .where('employee.id = :employeeId', { employeeId })
      .getOne();
  }

  private async updateProcessedCount(periodId: string, manager: EntityManager): Promise<void> {
    await manager.createQueryBuilder()
      .update(PayrollPeriod)
      .set({
        processed_employee_count: () => '"processed_employee_count" + 1'
      })
      .where('id = :periodId', { periodId })
      .execute();

    await this.checkAndCompletePayroll(periodId, manager);
  }

  private async updateFailedCount(periodId: string, manager: EntityManager): Promise<void> {
    await manager.createQueryBuilder()
      .update(PayrollPeriod)
      .set({
        failed_employee_count: () => '"failed_employee_count" + 1'
      })
      .where('id = :periodId', { periodId })
      .execute();

    await this.checkAndCompletePayroll(periodId, manager);
  }

  private async checkAndCompletePayroll(periodId: string, manager: EntityManager): Promise<void> {
    const period = await manager.findOneBy(PayrollPeriod, { id: periodId });
    
    if (!period) return;

    const totalProcessed = period.processed_employee_count + period.failed_employee_count;
    
    if (totalProcessed >= period.eligible_employee_count) {
      await manager.update(PayrollPeriod, { id: periodId }, {
        status: PayrollPeriodStatus.COMPLETED
      });
    }
  }
}
