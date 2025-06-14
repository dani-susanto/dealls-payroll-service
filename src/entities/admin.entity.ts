import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('admins')
export class Admin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
