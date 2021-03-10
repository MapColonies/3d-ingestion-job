import { Entity as OrmEntity, PrimaryColumn, Column } from 'typeorm';
import { Status } from '../../common/constants';
import { Metadata } from './metadata';

export interface IJob {
  jobId: string;
  path: string;
  metadata: Metadata;
  status: Status | string;
  created: Date;
  updated: Date;
}

@OrmEntity({ name: 'jobs' })
export class Job implements IJob {
  @PrimaryColumn({ type: 'uuid', name: 'job_id' })
  public jobId!: string;

  @Column({ type: 'text' })
  public path!: string;

  @Column({ type: 'simple-json' })
  public metadata!: Metadata;

  @Column({ type: 'enum', enum: Status, default: Status.PENDING })
  public status!: Status | string;

  @Column({ default: new Date() })
  public created!: Date;

  @Column({ default: new Date() })
  public updated!: Date;
}
