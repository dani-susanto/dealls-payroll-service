import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('admins')
export class Admin extends BaseEntity {
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
}
