import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { PayrollSummary } from './payroll-summary.entity';

export enum PayrollPeriodStatus {
  DRAFT = 'DRAFT',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED'
}

@Entity('payroll_periods')
export class PayrollPeriod {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  start_date: Date;

  @Column({ type: 'date' })
  end_date: Date;

  @Column({
    type: 'enum',
    enum: PayrollPeriodStatus,
  })
  status: PayrollPeriodStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => PayrollSummary, summary => summary.payroll_period)
  payroll_summaries: PayrollSummary[];

  @Column({ type: 'integer', default: 0 })
  eligible_employee_count: number;

  @Column({ type: 'integer', default: 0 })
  processed_employee_count: number;

  @Column({ type: 'integer', default: 0 })
  failed_employee_count: number;
}
