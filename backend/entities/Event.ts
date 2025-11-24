import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string; // 'view' | 'click' | 'login' | 'order'

  @Column({ nullable: true })
  productId: number;

  @Column({ nullable: true })
  userEmail: string;

  @Column({ nullable: true })
  metadata: string; // JSON

  @CreateDateColumn()
  createdAt: Date;
}
