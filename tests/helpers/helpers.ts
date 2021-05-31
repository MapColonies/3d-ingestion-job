/* eslint-disable @typescript-eslint/naming-convention */
import faker from 'faker';
import { IJob } from '../../src/job/models/job';

interface IntegrationJob extends Omit<IJob, 'created' | 'updated'> {
  created: string;
  updated: string;
}

export const createRandom = (): string => {
  const LEN = 36;
  return faker.random.alphaNumeric(LEN);
};

export const createUuid = (): string => {
  return faker.random.uuid();
};

export const createModelPath = (): string => {
  return '/tmp/tilesets/TilesetWithDiscreteLOD';
};

export const createMetadata = (): Record<string, never> => {
  return {
    id: createUuid() as never,
    name: faker.random.word() as never,
    version: 1 as never,
    description: faker.random.word() as never
  };
};

export const createFakeJob = (): IJob => {
  return { jobId: createUuid(), modelPath: createModelPath(), metadata: createMetadata(), status: 'Pending', created: new Date(), updated: new Date() };
};

export const convertTimestampToISOString = (job: IJob): IntegrationJob => {
  const { created, updated, ...others } = job;
  return { ...others, created: created.toISOString(), updated: updated.toISOString() };
};
