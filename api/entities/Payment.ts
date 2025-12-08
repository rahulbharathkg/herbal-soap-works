import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Order } from './Order.js';

@Entity()
export class Payment {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Order, (order) => order.id, { nullable: false })
    @JoinColumn({ name: 'orderId' })
    order: any;

    @Column({ type: 'int' })
    orderId: number;

    @Column({ type: 'varchar' })
    method: 'UPI' | 'BankTransfer';

    @Column({ type: 'varchar', nullable: true })
    reference?: string; // e.g., UPI transaction ID or bank reference number

    @Column({ type: 'decimal' })
    amount: number;

    @Column({ type: 'varchar', default: 'Pending' })
    status: 'Pending' | 'Completed' | 'Failed';

    @CreateDateColumn()
    createdAt: Date;
}
