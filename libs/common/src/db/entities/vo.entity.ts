import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'vo' })
export class VOEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, unique: true })
  groupId: string;

  @Column()
  name: string;

  @Column()
  district: string;

  @Column()
  clfId: string;
}
