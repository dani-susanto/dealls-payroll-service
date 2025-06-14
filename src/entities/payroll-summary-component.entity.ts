import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { PayrollSummary } from './payroll-summary.entity';

export enum PayrollSummaryComponentPaymentType {
  SALARY = 'SALARY',
  OVERTIME = 'OVERTIME',
  REIMBURSEMENT = 'REIMBURSEMENT'
}

@Entity('payroll_summary_components')
export class PayrollSummaryComponent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  payroll_summary_id: string;

  @Column({
    type: 'enum',
    enum: PayrollSummaryComponentPaymentType,
  })
  payment_type: PayrollSummaryComponentPaymentType;

  @Column({
    type: 'numeric',
    precision: 15,
    scale: 2,
    default: 0
  })
  amount: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => PayrollSummary)
  @JoinColumn({ name: 'payroll_summary_id' })
  payroll_summary: PayrollSummary;
}
