import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Employee } from './employee.entity';
import { PayrollPeriod } from './payroll-period.entity';
import { PayrollSummaryComponent } from './payroll-summary-component.entity';

@Entity('payroll_summaries')
export class PayrollSummary {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => PayrollPeriod)
  @JoinColumn({ name: 'payroll_period_id' })
  payroll_period: PayrollPeriod;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @OneToMany(() => PayrollSummaryComponent, component => component.payroll_summary)
  components: PayrollSummaryComponent[];
}
