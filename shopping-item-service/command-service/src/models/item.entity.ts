import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'items' })
export class Item {
  @PrimaryGeneratedColumn() // ✅ auto-increment integer
  itemId!: number;

  @Column({ nullable: false })
  name!: string;

  @Column('decimal', { nullable: false })
  price!: number;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt!: Date;
}


