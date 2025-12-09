import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { Order } from './Order.js';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  isAdmin: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  name: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar', default: 'user' })
  role: string; // 'user' or 'admin'

  @Column({ type: 'boolean', default: false })
  emailVerified: boolean;

  @Column({ type: 'boolean', default: false })
  isSubscribed: boolean;

  @Column({ type: 'varchar', nullable: true })
  verificationToken: string;

  @Column({ type: 'varchar', nullable: true })
  resetPasswordToken: string;

  @Column({ nullable: true, type: 'bigint' })
  resetPasswordExpires: number | null;

  @Column({ type: 'jsonb', nullable: true })
  addresses: any[];

  @OneToMany(() => Order, (order) => order.user)
  orders: any[];
}
