import { Entity as OrmEntity, PrimaryColumn, Column } from 'typeorm';

export interface IRequest {
  requestId: string;
  path: string;
  metadata: string;
}

@OrmEntity({ name: 'requests' })
export class Request implements IRequest {
  @PrimaryColumn({ name: 'request_id', length: 68 })
  public requestId!: string;

  @Column({ type: 'text', name: 'path' })
  public path!: string;

  @Column({ type: 'text', name: 'metadata' })
  public metadata!: string;
}
