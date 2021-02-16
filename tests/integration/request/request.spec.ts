import httpStatusCodes from 'http-status-codes';
import { container } from 'tsyringe';
import { Application } from 'express';
import { QueryFailedError } from 'typeorm';
import { registerTestValues } from '../testContainerConfig';
import { createFakeRequest, createPath, createMetadata, createUuid, createRandom } from '../../helpers/helpers';
import * as requestSender from './helpers/requestSender';
import { createDbRequest } from './helpers/db';

describe('request', function () {
  let app: Application;
  beforeAll(async function () {
    await registerTestValues();
    app = requestSender.getApp();
  });

  afterAll(function () {
    container.reset();
  });

  describe('GET /requests', function () {
    describe('Happy Path 🙂', function () {
      it('should return 204 if there are no requests', async function () {
        const response = await requestSender.getAll(app);

        expect(response.status).toBe(httpStatusCodes.NO_CONTENT);
      });

      it('should return 200 status code and a requests list', async function () {
        const request = await createDbRequest();

        const response = await requestSender.getAll(app);

        expect(response.status).toBe(httpStatusCodes.OK);
        expect(response.headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
        expect(response.body).toHaveLength(1);
        expect(response.body).toMatchObject([request]);
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

  describe('GET /requests/{requestId}', function () {
    describe('Happy Path 🙂', function () {
      it('should return 200 status code and the request', async function () {
        const request = await createDbRequest();

        const response = await requestSender.getRequest(app, request.requestId);

        expect(response.status).toBe(httpStatusCodes.OK);
        expect(response.headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
        expect(response.body).toMatchObject(request);
      });
    });

    describe('Bad Path 😡', function () {
      it('should return 400 status code and error message if request id is invalid (not a uuid format)', async function () {
        const response = await requestSender.getRequest(app, createRandom());

        expect(response.status).toBe(httpStatusCodes.BAD_REQUEST);
        expect(response.body).toHaveProperty('message', 'request.params.requestId should match format "uuid"');
      });
    });

    describe('Sad Path 😥', function () {
      it('should return 404 if a request with the requested id does not exist', async function () {
        const response = await requestSender.getRequest(app, createUuid());

        expect(response.status).toBe(httpStatusCodes.NOT_FOUND);
        expect(response.body).toHaveProperty('message', `Request with given id was not found.`);
      });

      it('should return 500 status code if a db exception happens', async function () {
        const findMock = jest.fn().mockRejectedValue(new QueryFailedError('select *', [], new Error('failed')));
        const mockedApp = requestSender.getMockedRepoApp({ findOne: findMock });

        const response = await requestSender.getRequest(mockedApp, createUuid());

        expect(response.status).toBe(httpStatusCodes.INTERNAL_SERVER_ERROR);
        expect(response.body).toHaveProperty('message', 'failed');
      });
    });
  });

  describe('POST /requests', function () {
    describe('Happy Path 🙂', function () {
      it('should return 201 status code and the added request', async function () {
        const request = { path: createPath(), metadata: createMetadata() };

        const response = await requestSender.createRequest(app, request);

        expect(response.status).toBe(httpStatusCodes.CREATED);
        expect(response.headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
      });
    });

    describe('Bad Path 😡', function () {
      it('should return 400 status code and error message if path is missing', async function () {
        const response = await requestSender.createRequest(app, { metadata: createMetadata() });

        expect(response.status).toBe(httpStatusCodes.BAD_REQUEST);
        expect(response.body).toHaveProperty('message', "request.body should have required property 'path'");
      });

      it('should return 400 status code and error message if metadata is missing', async function () {
        const response = await requestSender.createRequest(app, { path: createPath() });

        expect(response.status).toBe(httpStatusCodes.BAD_REQUEST);
        expect(response.body).toHaveProperty('message', "request.body should have required property 'metadata'");
      });
    });

    describe('Sad Path 😥', function () {
      it('should return 422 status code if a request with the same id exists', async function () {
        const request = createFakeRequest();
        const findMock = jest.fn().mockResolvedValue(request);
        const mockedApp = requestSender.getMockedRepoApp({ findOne: findMock });

        const response = await requestSender.createRequest(mockedApp, request);

        expect(response.status).toBe(httpStatusCodes.UNPROCESSABLE_ENTITY);
        expect(response.body).toHaveProperty('message', `requestId=${request.requestId} already exists`);
      });

      it('should return 500 status code if a db exception happens', async function () {
        const findMock = jest.fn().mockRejectedValue(new QueryFailedError('select *', [], new Error('failed')));
        const mockedApp = requestSender.getMockedRepoApp({ findOne: findMock });
        const request = { path: createPath(), metadata: createMetadata() };

        const response = await requestSender.createRequest(mockedApp, request);

        expect(response.status).toBe(httpStatusCodes.INTERNAL_SERVER_ERROR);
        expect(response.body).toHaveProperty('message', 'failed');
      });
    });
  });
});
