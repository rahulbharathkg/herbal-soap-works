import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  items: string; // JSON array [{productId, qty, price}]

  @Column('decimal')
  total: number;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  customerEmail: string;

  @CreateDateColumn()
  createdAt: Date;
}
