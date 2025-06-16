import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Employee } from './employee.entity';
import { PayrollPeriod } from './payroll-period.entity';
import { PayrollSummaryComponent } from './payroll-summary-component.entity';

@Entity('payroll_summaries')
export class PayrollSummary extends BaseEntity {
  @Column({ type: 'uuid' })
  payroll_period_id: string;

  @Column({ type: 'uuid' })
  employee_id: string;

  @Column({
    type: 'numeric',
    precision: 15,
    scale: 2,
    default: 0
  })
  take_home_pay_amount: number;

  @ManyToOne(() => PayrollPeriod)
  @JoinColumn({ name: 'payroll_period_id' })
  payroll_period: PayrollPeriod;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @OneToMany(() => PayrollSummaryComponent, component => component.payroll_summary)
  components: PayrollSummaryComponent[];
}
