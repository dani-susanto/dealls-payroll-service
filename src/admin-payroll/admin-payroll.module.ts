import { Module } from '@nestjs/common';
import { AdminPayrollController } from './admin-payroll.controller';
import { AdminPayrollService } from './admin-payroll.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayrollPeriod } from 'src/entities/payroll-period.entity';
import { PayrollSummary } from 'src/entities/payroll-summary.entity';
import { PayrollSummaryComponent } from 'src/entities/payroll-summary-component.entity';
import { EmployeeAttendance } from 'src/entities/employee-attendance.entity';
import { EmployeeOvertime } from 'src/entities/employee-overtime.entity';
import { EmployeeReimbursement } from 'src/entities/employee-reimbursement.entity';
import { Employee } from 'src/entities/employee.entity';
import { BullModule } from '@nestjs/bullmq';
import { InitProcessEmployeePayrollJob } from './jobs/init-process-employee-payroll.job';
import { ProcessEmployeePayrollJob } from './jobs/process-employee-payroll.job';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PayrollPeriod,
      PayrollSummary,
      PayrollSummaryComponent,
      EmployeeAttendance,
      EmployeeOvertime,
      EmployeeReimbursement,
      Employee
    ]),
    BullModule.registerQueue(
      {
        name: 'init-process-employee-payroll',
        defaultJobOptions: {
          removeOnComplete: true,
          removeOnFail: false,
          attempts: 3
        }
      },
      {
        name: 'process-employee-payroll',
        defaultJobOptions: {
          removeOnComplete: true,
          removeOnFail: false,
          attempts: 3
        }
      }
    ),
  ],
  controllers: [AdminPayrollController],
  providers: [AdminPayrollService, InitProcessEmployeePayrollJob, ProcessEmployeePayrollJob],
})
export class AdminPayrollModule {}
