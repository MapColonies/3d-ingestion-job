import { container } from 'tsyringe';
import { Connection } from 'typeorm';
import { createFakeJob } from '../../../helpers/helpers';
import { IJob, Job } from '../../../../src/job/models/job';

export const createDbJob = async (): Promise<IJob> => {
  const conn = container.resolve(Connection);
  const repo = conn.getRepository(Job);
  const job = repo.create(createFakeJob());
  const createdJob = await repo.save(job);
  return createdJob;
};
