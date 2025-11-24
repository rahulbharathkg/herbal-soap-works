import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class AdminLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  action: string;

  @Column({ nullable: true })
  userEmail: string;

  @Column('text', { nullable: true })
  details: string;

  @CreateDateColumn()
  createdAt: Date;
}
