import { PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { ClsServiceManager } from 'nestjs-cls';


export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  created_by: string;

  @Column({ type: 'uuid', nullable: true })
  updated_by: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;


  @BeforeInsert()
  setCreatedBy() {
    const cls = ClsServiceManager.getClsService();
    const userId = cls.get('userId');
    this.created_by = userId;
    this.updated_by = userId;
  }

  @BeforeUpdate()
  setUpdatedBy() {
    const cls = ClsServiceManager.getClsService();
    const userId = cls.get('userId');
    this.updated_by = userId;
  }
}
