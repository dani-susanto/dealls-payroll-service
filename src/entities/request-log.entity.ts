import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('request_logs')
export class RequestLog extends BaseEntity {
  @Column({ type: 'uuid', unique: true, nullable: true })
  request_id: string;

  @Column({ type: 'varchar', length: 10 })
  method: string;

  @Column({ type: 'varchar', length: 255 })
  path: string;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ip_address: string;

  @Column({ type: 'text', nullable: true })
  user_agent: string;

  @Column({ type: 'text', nullable: true })
  request_body: string;

  @Column({ type: 'uuid', nullable: true })
  user_id: string;

  @Column({ type: 'integer', nullable: true })
  response_code: number;

  @Column({ type: 'text', nullable: true })
  response_body: string;

  @Column({ type: 'text', nullable: true })
  error_message: string;
}
