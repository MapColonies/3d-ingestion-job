/* eslint-disable @typescript-eslint/naming-convention */
import faker from 'faker';
import { Metadata } from '../../src/job/models/metadata';
import { IJob } from '../../src/job/models/job';

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

export const createDate = (): Date => {
  return faker.date.past();
};

export const createMetadata = (): Metadata => {
  return {
    productId: 'string',
    productName: 'string',
    geographicArea: 'string',
    productVersion: 1,
    productType: '3DModel',
    description: 'string',
    classification: 'string',
    footprint: 'string',
    extentLowerLeft: 'string',
    extentUpperRight: 'string',
    SourceDateStart: createDate(),
    SourceDateEnd: createDate(),
    producerName: 'IDFMU',
    SRS: 'string',
    SRSOrigin: 'string',
    nominalResolution: 'string',
    accuracyLE90: 'string',
    horizontalAccuracyCE90: 'string',
    relativeAccuracyLE90: 'string',
    heightRangeFrom: 0,
    heightRangeTo: 0,
    sensor: ['string'],
    productionMethod: 'Photogrammetric',
    productionSystem: 'string',
  };
};

export const createFakeJob = (): IJob => {
  return { jobId: createUuid(), path: createPath(), metadata: createMetadata(), status: 'In-Progress', created: new Date(), updated: new Date() };
};
