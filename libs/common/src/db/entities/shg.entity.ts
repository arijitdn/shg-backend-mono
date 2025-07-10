import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'shg' })
export class SHGEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, unique: true })
  groupId: string;

  @Column({ nullable: false })
  name: string;

  @Column()
  block: string;

  @Column()
  district: string;

  @Column()
  voId: string;

  @Column()
  clfId: string;
}
