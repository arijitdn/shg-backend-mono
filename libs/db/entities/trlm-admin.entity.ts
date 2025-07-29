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

  @Column()
  designation: string;

  @Column({ default: 'active' })
  status: string;

  @Column({ type: 'date', nullable: true })
  joinDate: Date;

  @Column()
  postId: string;

  @Column({
    type: 'enum',
    enum: TRLMLevel,
    default: TRLMLevel.DMMU,
  })
  level: TRLMLevel;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
