import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum TRLMLevel {
  DMMU = 'DMMU',
  BMMU = 'BMMU',
  NIC = 'NIC',
}

@Entity({ name: 'trlm' })
export class TRLMAdminEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  designation: string;

  @Column({ default: 'active' })
  status: string;

  @Column({ type: 'date', nullable: true })
  joinDate: Date;

  @Column({ nullable: true })
  postId: string;

  @Column({
    type: 'enum',
    enum: TRLMLevel,
    default: TRLMLevel.DMMU,
  })
  role: TRLMLevel;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
