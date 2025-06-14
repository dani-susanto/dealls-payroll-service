import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployeeAttendance } from '../entities/employee-attendance.entity';
import { EmployeeOvertime } from '../entities/employee-overtime.entity';
import { EmployeeReimbursement } from '../entities/employee-reimbursement.entity';

@Injectable()
export class EmployeeActivityService {
  constructor(
    @InjectRepository(EmployeeAttendance)
    private employeeAttendanceRepository: Repository<EmployeeAttendance>,
    @InjectRepository(EmployeeOvertime)
    private employeeOvertimeRepository: Repository<EmployeeOvertime>,
    @InjectRepository(EmployeeReimbursement)
    private employeeReimbursementRepository: Repository<EmployeeReimbursement>,
  ) {}

  async submitAttendance(employeeId: string): Promise<EmployeeAttendance> {
    const today = new Date();
    const dayOfWeek = today.getDay();

    if (dayOfWeek === 0 || dayOfWeek === 6) throw new BadRequestException('Cannot submit attendance on weekends');

    const existingAttendance = await this.employeeAttendanceRepository.findOne({
      where: {
        employee_id: employeeId,
        attendance_date: today
      }
    });

    if (existingAttendance) return existingAttendance;

    return await this.employeeAttendanceRepository.save({
      employee_id: employeeId,
      attendance_date: today
    });
  }

  async submitOvertime(employeeId: string, extraHour: number): Promise<EmployeeOvertime> {
    const now = new Date();
    const currentHour = now.getHours();
    const dayOfWeek = now.getDay();

    if (dayOfWeek !== 0 && dayOfWeek !== 6 && currentHour < 17) throw new BadRequestException('On weekdays, overtime can only be submitted after 5 PM');
  
    const existingOvertime = await this.employeeOvertimeRepository.findOne({
      where: {
        employee_id: employeeId,
        overtime_date: now
      }
    });

    if (existingOvertime) throw new BadRequestException('Overtime already submitted for today');

    return await this.employeeOvertimeRepository.save({
      employee_id: employeeId,
      overtime_date: now,
      extra_hour: extraHour
    });
  }

  async submitReimbursement(
    employeeId: string,
    amount: number,
    description: string
  ): Promise<EmployeeReimbursement> {
    return await this.employeeReimbursementRepository.save({
      employee_id: employeeId,
      reimbursement_date: new Date(),
      amount,
      description
    });
  }
}
