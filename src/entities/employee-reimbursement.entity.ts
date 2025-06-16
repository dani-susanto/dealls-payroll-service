import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Employee } from './employee.entity';

@Entity('employee_reimbursements')
export class EmployeeReimbursement extends BaseEntity {
  @Column({ type: 'uuid' })
  employee_id: string;

  @Column({ type: 'date' })
  reimbursement_date: Date;

  @Column({
    type: 'numeric',
    precision: 15,
    scale: 2,
    default: 0
  })
  amount: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;
}
