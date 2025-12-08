import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Payment } from './Payment.js';
import { User } from './User.js';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  items: string; // JSON array [{productId, qty, price}]

  @Column('decimal')
  total: number;

  @Column({ type: 'varchar', nullable: true })
  location: string;

  @Column({ type: 'varchar', nullable: true })
  customerEmail: string;

  @ManyToOne(() => User, (user) => user.orders, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: any;

  @Column({ type: 'int', nullable: true })
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Payment, (payment) => payment.order)
  payments: Payment[];
}
