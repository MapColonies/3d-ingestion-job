import httpStatusCodes from 'http-status-codes';
import { container } from 'tsyringe';
import { Application } from 'express';
import { QueryFailedError, Repository } from 'typeorm';
import { registerTestValues } from '../../testContainerConfig';
import { createFakeJob, createModelPath, createMetadata, createUuid, createRandom, convertTimestampToISOString } from '../../../helpers/helpers';
import * as requestSender from './helpers/requestSender';
import { createDbJob, getRepositoryFromContainer } from './helpers/db';
import { Job } from '../../../../src/job/models/job';

describe('JobsController', function () {
  let app: Application;
  let repository: Repository<Job>;

  beforeAll(async function () {
    await registerTestValues();
    app = requestSender.getApp();
    repository = getRepositoryFromContainer(Job);
    await repository.clear();
  });

  afterAll(function () {
    container.reset();
  });

  describe('GET /jobs', function () {
    describe('Happy Path 🙂', function () {
      it('should return 204 if there are no jobs', async function () {
        const response = await requestSender.getAll(app);

        expect(response.status).toBe(httpStatusCodes.NO_CONTENT);
      });

      it('should return 200 status code and a jobs list', async function () {
        const job = await createDbJob();

        const response = await requestSender.getAll(app);

        expect(response.status).toBe(httpStatusCodes.OK);
        expect(response.headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
        expect(response.body).toHaveLength(1);
        expect(response.body).toMatchObject([convertTimestampToISOString(job)]);
      });
    });

    describe('Bad Path 😡', function () {
      // No bad paths here!
    });

    describe('Sad Path 😥', function () {
      it('should return 500 status code if a db exception happens', async function () {
        const findMock = jest.fn().mockRejectedValue(new QueryFailedError('select *', [], new Error('failed')));
        const mockedApp = requestSender.getMockedRepoApp({ find: findMock });

        const response = await requestSender.getAll(mockedApp);

        expect(response.status).toBe(httpStatusCodes.INTERNAL_SERVER_ERROR);
        expect(response.body).toHaveProperty('message', 'failed');
      });
    });
  });

  describe('GET /jobs/{jobId}', function () {
    describe('Happy Path 🙂', function () {
      it('should return 200 status code and the job', async function () {
        const job = await createDbJob();

        const response = await requestSender.getJob(app, job.jobId);

        expect(response.status).toBe(httpStatusCodes.OK);
        expect(response.headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
        expect(response.body).toMatchObject(convertTimestampToISOString(job));
      });
    });

    describe('Bad Path 😡', function () {
      it('should return 400 status code and error message if job id is invalid (not a uuid format)', async function () {
        const response = await requestSender.getJob(app, createRandom());

        expect(response.status).toBe(httpStatusCodes.BAD_REQUEST);
        expect(response.body).toHaveProperty('message', 'request.params.jobId should match format "uuid"');
      });
    });

    describe('Sad Path 😥', function () {
      it('should return 404 if a job with the requested id does not exist', async function () {
        const response = await requestSender.getJob(app, createUuid());

        expect(response.status).toBe(httpStatusCodes.NOT_FOUND);
        expect(response.body).toHaveProperty('message', `Job with given id was not found.`);
      });

      it('should return 500 status code if a db exception happens', async function () {
        const findMock = jest.fn().mockRejectedValue(new QueryFailedError('select *', [], new Error('failed')));
        const mockedApp = requestSender.getMockedRepoApp({ findOne: findMock });

        const response = await requestSender.getJob(mockedApp, createUuid());

        expect(response.status).toBe(httpStatusCodes.INTERNAL_SERVER_ERROR);
        expect(response.body).toHaveProperty('message', 'failed');
      });
    });
  });

  describe('POST /jobs', function () {
    describe('Happy Path 🙂', function () {
      it('should return 201 status code and the added job', async function () {
        const job = { modelPath: createModelPath(), metadata: createMetadata() };

        const response = await requestSender.createJob(app, job);

        expect(response.status).toBe(httpStatusCodes.CREATED);
        expect(response.headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
      });
    });

    describe('Bad Path 😡', function () {
      it('should return 400 status code and error message if model path field is missing', async function () {
        const response = await requestSender.createJob(app, { metadata: createMetadata() });

        expect(response.status).toBe(httpStatusCodes.BAD_REQUEST);
        expect(response.body).toHaveProperty('message', "request.body should have required property 'modelPath'");
      });

      it('should return 400 status code and error message if metadata field is missing', async function () {
        const response = await requestSender.createJob(app, { modelPath: createModelPath() });

        expect(response.status).toBe(httpStatusCodes.BAD_REQUEST);
        expect(response.body).toHaveProperty('message', "request.body should have required property 'metadata'");
      });
    });

    describe('Sad Path 😥', function () {
      it('should return 422 status code if a job with the same id already exists', async function () {
        const job = createFakeJob();
        const findMock = jest.fn().mockResolvedValue(job);
        const mockedApp = requestSender.getMockedRepoApp({ findOne: findMock });

        const response = await requestSender.createJob(mockedApp, job);

        expect(response.status).toBe(httpStatusCodes.UNPROCESSABLE_ENTITY);
        expect(response.body).toHaveProperty('message', `Job ${job.jobId} already exists`);
      });

      it('should return 500 status code if a db exception happens', async function () {
        const findMock = jest.fn().mockRejectedValue(new QueryFailedError('select *', [], new Error('failed')));
        const mockedApp = requestSender.getMockedRepoApp({ findOne: findMock });
        const job = { modelPath: createModelPath(), metadata: createMetadata() };

        const response = await requestSender.createJob(mockedApp, job);

        expect(response.status).toBe(httpStatusCodes.INTERNAL_SERVER_ERROR);
        expect(response.body).toHaveProperty('message', 'failed');
      });
    });
  });

  describe('PATCH /jobs/{jobId}', function () {
    describe('Happy Path 🙂', function () {
      it('should return 200 status code and the updated job', async function () {
        const job = createFakeJob();
        const findMock = jest.fn().mockResolvedValue(job);
        job.status = 'Completed';
        const saveMock = jest.fn().mockResolvedValue(job);
        const mockedApp = requestSender.getMockedRepoApp({ findOne: findMock, save: saveMock });

        const response = await requestSender.updateJob(mockedApp, job.jobId, job);

        expect(response.status).toBe(httpStatusCodes.OK);
        expect(response.headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
        expect(response.body).toMatchObject(convertTimestampToISOString(job));
      });
    });

    describe('Bad Path 😡', function () {
      it('should return 400 status code and error message if status field is missing', async function () {
        const job = createFakeJob();
        delete job.status;
        const response = await requestSender.updateJob(app, job.jobId, job);

        expect(response.status).toBe(httpStatusCodes.BAD_REQUEST);
        expect(response.body).toHaveProperty('message', "request.body should have required property 'status'");
      });
    });

    describe('Sad Path 😥', function () {
      it('should return 404 status code if the job does not exist', async function () {
        const job = createFakeJob();
        const findMock = jest.fn().mockResolvedValue(undefined);
        const mockedApp = requestSender.getMockedRepoApp({ findOne: findMock });

        const response = await requestSender.updateJob(mockedApp, job.jobId, job);

        expect(response.status).toBe(httpStatusCodes.NOT_FOUND);
        expect(response.body).toHaveProperty('message', `Job ${job.jobId} does not exist`);
      });

      it('should return 500 status code if a db exception happens', async function () {
        const job = createFakeJob();
        const findMock = jest.fn().mockResolvedValue(job);
        job.status = 'Completed';
        const saveMock = jest.fn().mockRejectedValue(new QueryFailedError('select *', [], new Error('failed')));
        const mockedApp = requestSender.getMockedRepoApp({ findOne: findMock, save: saveMock });

        const response = await requestSender.updateJob(mockedApp, job.jobId, job);

        expect(response.status).toBe(httpStatusCodes.INTERNAL_SERVER_ERROR);
        expect(response.body).toHaveProperty('message', 'failed');
      });
    });
  });
});
