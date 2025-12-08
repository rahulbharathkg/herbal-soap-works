import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  type: string; // 'view' | 'click' | 'login' | 'order'

  @Column({ type: 'int', nullable: true })
  productId: number;

  @Column({ type: 'varchar', nullable: true })
  userEmail: string;

  @Column({ type: 'text', nullable: true })
  metadata: string; // JSON

  @CreateDateColumn()
  createdAt: Date;
}
