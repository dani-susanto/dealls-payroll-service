import { Module } from '@nestjs/common';
import { EmployeeActivityController } from './employee-activity.controller';
import { EmployeeActivityService } from './employee-activity.service';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeAttendance } from 'src/entities/employee-attendance.entity';
import { EmployeeOvertime } from 'src/entities/employee-overtime.entity';
import { EmployeeReimbursement } from 'src/entities/employee-reimbursement.entity';
import { Employee } from 'src/entities/employee.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Employee,
      EmployeeAttendance,
      EmployeeOvertime,
      EmployeeReimbursement
    ]), 
  ],
  controllers: [EmployeeActivityController],
  providers: [EmployeeActivityService],
})
export class EmployeeActivityModule {}
