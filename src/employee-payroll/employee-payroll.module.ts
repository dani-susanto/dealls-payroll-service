import { Module } from '@nestjs/common';
import { EmployeePayrollController } from './employee-payroll.controller';
import { EmployeePayrollService } from './employee-payroll.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayrollPeriod } from 'src/entities/payroll-period.entity';
import { PayrollSummary } from 'src/entities/payroll-summary.entity';
import { Employee } from 'src/entities/employee.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PayrollPeriod,
      PayrollSummary,
      Employee
    ]),
  ],
  controllers: [EmployeePayrollController],
  providers: [EmployeePayrollService],
})
export class EmployeePayrollModule {}
