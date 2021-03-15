/* eslint-disable @typescript-eslint/naming-convention */
import faker from 'faker';
import { Metadata } from '../../src/job/models/metadata';
import { IJob } from '../../src/job/models/job';

interface IntegrationMetadata extends Omit<Metadata, 'SourceDateStart' | 'SourceDateEnd'> {
  SourceDateStart: string;
  SourceDateEnd: string;
}

interface IntegrationJob extends Omit<IJob, 'created' | 'updated' | 'metadata'> {
  metadata: IntegrationMetadata;
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

export const createPath = (): string => {
  return '/usr/share/nginx/downloads';
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
    SourceDateStart: new Date(),
    SourceDateEnd: new Date(),
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
  return { jobId: createUuid(), path: createPath(), metadata: createMetadata(), status: 'Pending', created: new Date(), updated: new Date() };
};

export const convertTimestampToISOString = (job: IJob): IntegrationJob => {
  const { metadata, created, updated, ...others } = job;
  const { SourceDateStart, SourceDateEnd, ...rest } = metadata;
  const integrationMetadata = { ...rest, SourceDateStart: SourceDateStart.toISOString(), SourceDateEnd: SourceDateEnd.toISOString() };
  return { ...others, metadata: integrationMetadata, created: created.toISOString(), updated: updated.toISOString() };
};
