import { Entity, Column, PrimaryColumn, UpdateDateColumn, Generated, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { OperationStatus } from '../../common/constants';
import { Job } from './job';

export interface ITask {
  id: string;
  jobId: string;
  description?: string;
  parameters?: Record<string, never>;
  creationTime?: Date;
  updateTime?: Date;
  status: OperationStatus;
  percentage?: number;
  reason?: string;
  attempts: number;
}

@Entity('Task')
export class Task implements ITask {
  @PrimaryColumn({ type: 'uuid' })
  @Generated('uuid')
  public id!: string;

  @ManyToOne(() => Job, (job) => job.tasks, { nullable: false })
  @JoinColumn({ name: 'jobId' })
  public jobId!: string;

  @Column('varchar', { length: 255 })
  public type?: string;

  @Column('varchar', { length: 2000, default: '', nullable: false })
  public description!: string;

  @Column('jsonb', { nullable: false })
  public parameters!: Record<string, never>;

  @CreateDateColumn()
  public creationTime?: Date;

  @UpdateDateColumn()
  public updateTime?: Date;

  @Column({ type: 'enum', enum: OperationStatus, default: OperationStatus.PENDING, nullable: false })
  public status!: OperationStatus;

  @Column('smallint', { nullable: true })
  public percentage?: number;

  @Column('varchar', { length: 255, default: '', nullable: false })
  public reason!: string;

  @Column('integer', { nullable: false, default: 0 })
  public attempts!: number;

  public constructor();
  public constructor(init: Partial<Task>);
  public constructor(...args: [] | [Partial<Task>]) {
    if (args.length === 1) {
      Object.assign(this, args[0]);
    }
  }
}
