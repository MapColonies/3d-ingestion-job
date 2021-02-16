import faker from 'faker';
import { IRequest } from '../../src/request/models/request';

export const createRandom = (): string => {
  const LEN = 36;
  return faker.random.alphaNumeric(LEN);
};

export const createUuid = (): string => {
  return faker.random.uuid();
};

export const createPath = (): string => {
  return '/usr/share/nginx/downloads';
};

export const createMetadata = (): string => {
  return '{ "Source": "CNES/Airbus Maxar Technologies", "Camera": "1,492m", "Location": "0.1318, 73.1620" }';
};

export const createFakeRequest = (): IRequest => {
  return { requestId: createUuid(), path: createPath(), metadata: createMetadata() };
};
