import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('decimal')
  price: number;

  @Column('decimal', { default: 0 })
  cost: number;

  @Column({ nullable: true })
  imageUrl: string;

  @Column('text', { nullable: true })
  layout: string; // JSON string describing layout/blocks/animations
}
