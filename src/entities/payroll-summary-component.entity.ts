import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { PayrollSummary } from './payroll-summary.entity';

export enum PayrollSummaryComponentPaymentType {
  SALARY = 'SALARY',
  OVERTIME = 'OVERTIME',
  REIMBURSEMENT = 'REIMBURSEMENT'
}

@Entity('payroll_summary_components')
export class PayrollSummaryComponent extends BaseEntity {
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

  @ManyToOne(() => PayrollSummary)
  @JoinColumn({ name: 'payroll_summary_id' })
  payroll_summary: PayrollSummary;
}
