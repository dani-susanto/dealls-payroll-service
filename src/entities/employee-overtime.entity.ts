import { Check, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Employee } from './employee.entity';

@Check(`"extra_hour" > 0 AND "extra_hour" <= 3`)
@Entity('employee_overtimes')
export class EmployeeOvertime extends BaseEntity {
  @Column({ type: 'uuid' })
  employee_id: string;

  @Column({ type: 'date' })
  overtime_date: Date;

  @Column({ type: 'integer' })
  extra_hour: number;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;
}
