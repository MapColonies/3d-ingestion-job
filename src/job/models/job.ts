import { Entity, Column, PrimaryColumn, Index, UpdateDateColumn, Generated, CreateDateColumn, OneToMany } from 'typeorm';
import { OperationStatus } from '../../common/constants';
import { ITask, Task } from './task';

export interface IJob {
  id?: string;
  resourceId: string;
  version: string;
  type: string;
  description?: string;
  parameters: Record<string, never>;
  creationTime?: Date;
  updateTime?: Date;
  status: OperationStatus;
  reason?: string;
  tasks?: ITask[];
}

@Entity('Job')
@Index('jobResourceIndex', ['resourceId', 'version'], { unique: false })
@Index('jobStatusIndex', ['status'], { unique: false })
@Index('jobTypeIndex', ['type'], { unique: false })
@Index('jobCleanedIndex', ['isCleaned'], { unique: false })
export class Job implements IJob {
  @PrimaryColumn({ type: 'uuid' })
  @Generated('uuid')
  public id!: string;

  @Column('varchar', { length: 300, nullable: false })
  public resourceId!: string;

  @Column('varchar', { length: 30, nullable: false })
  public version!: string;

  @Column('varchar', { length: 255, nullable: false })
  public type!: string;

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

  @Column('boolean', { default: false, nullable: false })
  public isCleaned!: boolean;

  @OneToMany(() => Task, (task) => task.jobId, {
    cascade: true,
  })
  public tasks?: Task[];

  public constructor();
  public constructor(init: Partial<Job>);
  public constructor(...args: [] | [Partial<Job>]) {
    if (args.length === 1) {
      Object.assign(this, args[0]);
    }
  }
}
