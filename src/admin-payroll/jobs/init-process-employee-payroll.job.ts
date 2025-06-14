import { Processor, WorkerHost, InjectQueue } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PayrollPeriod } from '../../entities/payroll-period.entity';
import { AdminPayrollService } from '../admin-payroll.service';

interface InitPayrollPayload {
  periodId: string;
}

@Processor('init-process-employee-payroll')
export class InitProcessEmployeePayrollJob extends WorkerHost {
  constructor(
    @InjectRepository(PayrollPeriod)
    private payrollPeriodRepository: Repository<PayrollPeriod>,
    @InjectQueue('process-employee-payroll')
    private employeePayrollQueue: Queue,
    private adminPayrollService: AdminPayrollService
  ) {
    super();
  }

  async process(job: Job<InitPayrollPayload>): Promise<void> {
    const { periodId } = job.data;
    const period = await this.payrollPeriodRepository.findOneBy({ id: periodId });
    
    if (!period) return;

    const workingDays = this.adminPayrollService.calculateWorkingDays(period.start_date, period.end_date);
    const employees = await this.adminPayrollService.getEligibleEmployees(period);
    
    period.eligible_employee_count = employees.length;
    await this.payrollPeriodRepository.save(period);

    await Promise.all(
      employees.map(employee => 
        this.employeePayrollQueue.add('process-employee-payroll', {
          periodId,
          employeeId: employee.id,
          workingDays
        }, {
          removeOnComplete: true,
          attempts: 3
        })
      )
    );
  }
}
