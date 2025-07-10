import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { VOEntity } from './vo.entity';
import { SHGEntity } from './shg.entity';

@Entity({ name: 'clf' })
export class CLFEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, unique: true })
  groupId: string;

  @Column()
  name: string;

  @Column()
  district: string;
}
