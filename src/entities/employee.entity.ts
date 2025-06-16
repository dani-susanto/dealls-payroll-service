import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { EmployeeAttendance } from './employee-attendance.entity';
import { EmployeeOvertime } from './employee-overtime.entity';
import { EmployeeReimbursement } from './employee-reimbursement.entity';
import { PayrollSummary } from './payroll-summary.entity';

export enum EmployeeStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

@Entity('employees')
export class Employee extends BaseEntity {
  @Column({ 
    type: 'varchar', 
    length: 200 
  })
  name: string;

  @Column({ 
    type: 'varchar', 
    length: 150, 
    unique: true 
  })
  username: string;

  @Column({ 
    type: 'varchar', 
    length: 255 
  })
  password: string;

  @Column({ 
    type: 'numeric',
    precision: 15,
    scale: 2,
    default: 0
  })
  basic_salary_amount: number;

  @Column({
    type: 'enum',
    enum: EmployeeStatus,
    default: EmployeeStatus.ACTIVE
  })
  status: EmployeeStatus;

  @OneToMany(() => EmployeeAttendance, attendance => attendance.employee)
  attendances: EmployeeAttendance[];

  @OneToMany(() => EmployeeOvertime, overtime => overtime.employee)
  overtimes: EmployeeOvertime[];

  @OneToMany(() => EmployeeReimbursement, reimbursement => reimbursement.employee)
  reimbursements: EmployeeReimbursement[];

  @OneToMany(() => PayrollSummary, summary => summary.employee)
  payroll_summaries: PayrollSummary[];
}
