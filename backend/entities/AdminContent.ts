import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from "typeorm";

@Entity()
export class AdminContent {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', unique: true })
    key!: string; // e.g., "home_hero_title", "home_hero_image"

    @Column("text")
    value!: string; // The content itself

    @Column({ type: 'varchar' })
    type!: string; // "text", "image", "css"

    @UpdateDateColumn()
    updatedAt!: Date;
}
