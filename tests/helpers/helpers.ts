/* eslint-disable @typescript-eslint/naming-convention */
import faker from 'faker';
import { OperationStatus } from '../../src/common/constants';
import { IJob } from '../../src/job/models/job';

interface IntegrationJob extends Omit<IJob, 'creationTime' | 'updateTime'> {
  creationTime: string;
  updateTime: string;
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
  const parameters = { /*modelPath: createModelPath(), metadata: createMetadata()*/ };
  return { id: createUuid(), resourceId: createUuid(), version: '1', type: '3D', parameters, status: OperationStatus.PENDING, creationTime: new Date(), updateTime: new Date() };
};

export const convertTimestampToISOString = (job: IJob): IntegrationJob => {
  const { creationTime, updateTime, ...others } = job;
  return { ...others, creationTime: creationTime.toISOString(), updateTime: updateTime.toISOString() };
};
