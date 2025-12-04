import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Order } from './Order.js';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  name: string;

  @Column()
  password: string;

  @Column({ default: 'user' })
  role: string; // 'user' or 'admin'

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ default: false })
  isSubscribed: boolean;

  @Column({ nullable: true })
  verificationToken: string;

  @Column({ nullable: true })
  resetPasswordToken: string;

  @Column({ nullable: true, type: 'bigint' })
  resetPasswordExpires: number | null;

  @OneToMany(() => Order, (order) => order.user)
  orders: any[];
}
