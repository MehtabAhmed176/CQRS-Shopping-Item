// src/entities/OutboxEntity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('outbox')
export class OutboxEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  eventType!: string;

  @Column({ type: 'jsonb' })
  payload!: Record<string, any>;

  @Column({ default: false })
  processed!: boolean;

  @Column({ type: 'int', default: 0 })
  retryCount!: number;

  @CreateDateColumn()
  createdAt!: Date;
}
