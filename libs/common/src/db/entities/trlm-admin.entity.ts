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

  @Column({ type: 'enum', enum: TRLMLevel })
  level: TRLMLevel;

  @Column({ type: 'enum', enum: employeePost })
  post: employeePost;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
