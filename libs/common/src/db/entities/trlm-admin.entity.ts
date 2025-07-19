import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TRLMLevel } from '../enums/trlm-level.enum';
import { employeePost } from '../enums/employee-post.enum';

@Entity({ name: 'trlm_admin' })
export class TRLMAdminEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  password: string;

  @Column()
  designation: string;

  @Column({ default: 'active' })
  status: string; // or use an enum if you want

  @Column({ type: 'date', nullable: true })
  joinDate: Date;

  @Column()
  post: string; 

  @Column({ type: 'enum', enum: TRLMLevel })
  level: TRLMLevel;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
