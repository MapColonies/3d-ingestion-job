import { Entity as OrmEntity, PrimaryColumn, Column } from 'typeorm';
import { Status } from '../../common/constants';

export interface IJob {
  jobId: string;
  modelPath: string;
  metadata: object;
  status: Status | string;
  created: Date;
  updated: Date;
}

@OrmEntity({ name: 'jobs' })
export class Job implements IJob {
  @PrimaryColumn({ type: 'uuid', name: 'job_id' })
  public jobId!: string;

  @Column({ type: 'text', name: 'model_path' })
  public modelPath!: string;

  @Column({ type: 'simple-json' })
  public metadata!: object;

  @Column({ type: 'enum', enum: Status, default: Status.PENDING })
  public status!: Status | string;

  @Column({ default: new Date() })
  public created!: Date;

  @Column({ default: new Date() })
  public updated!: Date;
}
