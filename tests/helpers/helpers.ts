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

export const createMetadata = (): object => {
  return {
    id: createUuid(),
    name: faker.random.word(),
    version: 1,
    description: faker.random.word()
  };
};

export const createFakeJob = (): IJob => {
  return { jobId: createUuid(), modelPath: createModelPath(), metadata: createMetadata(), status: 'Pending', created: new Date(), updated: new Date() };
};

export const convertTimestampToISOString = (job: IJob): IntegrationJob => {
  const { created, updated, ...others } = job;
  return { ...others, created: created.toISOString(), updated: updated.toISOString() };
};
