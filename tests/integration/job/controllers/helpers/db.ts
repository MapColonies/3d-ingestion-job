import { container } from 'tsyringe';
import { Connection, EntityTarget, Repository } from 'typeorm';
import { createFakeJob } from '../../../../helpers/helpers';
import { IJob, Job } from '../../../../../src/job/models/job';

export const getRepositoryFromContainer = <T>(target: EntityTarget<T>): Repository<T> => {
  const connection = container.resolve(Connection);
  return connection.getRepository<T>(target);
};

export const createDbJob = async (): Promise<IJob> => {
  const repository = getRepositoryFromContainer(Job);
  const job = repository.create(createFakeJob());
  const createdJob = await repository.save(job);
  return createdJob;
};
