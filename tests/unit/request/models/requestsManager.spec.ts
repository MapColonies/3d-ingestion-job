import { QueryFailedError, Repository } from 'typeorm';
import { Request } from '../../../../src/request/models/request';
import { RequestsManager } from '../../../../src/request/models/requestsManager';
import { IdAlreadyExistsError } from '../../../../src/request/models/errors';
import { createFakeRequest, createUuid } from '../../../helpers/helpers';

let requestsManager: RequestsManager;

describe('RequestsManager', () => {
  describe('#createRequest', () => {
    let insert: jest.Mock;
    let findOne: jest.Mock;
    beforeEach(() => {
      insert = jest.fn();
      findOne = jest.fn();
      const repository = ({ insert, findOne } as unknown) as Repository<Request>;
      requestsManager = new RequestsManager(repository, { log: jest.fn() });
    });
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('resolves without errors if id is not in use', async () => {
      findOne.mockResolvedValue(undefined);
      insert.mockResolvedValue(undefined);
      const request = createFakeRequest();

      const createPromise = requestsManager.createRequest(request);

      await expect(createPromise).resolves.not.toThrow();
    });

    it('rejects on DB error', async () => {
      findOne.mockRejectedValue(new QueryFailedError('select *', [], new Error()));
      const request = createFakeRequest();

      const createPromise = requestsManager.createRequest(request);

      await expect(createPromise).rejects.toThrow(QueryFailedError);
    });

    it('rejects if id already exists', async () => {
      const request = createFakeRequest();
      findOne.mockResolvedValue(request);
      insert.mockResolvedValue(undefined);

      const createPromise = requestsManager.createRequest(request);

      await expect(createPromise).rejects.toThrow(IdAlreadyExistsError);
    });
  });

  describe('#getAll', () => {
    const find = jest.fn();
    beforeEach(() => {
      const repository = ({ find } as unknown) as Repository<Request>;
      requestsManager = new RequestsManager(repository, { log: jest.fn() });
    });
    afterEach(() => {
      find.mockClear();
    });

    it('returns a requests list', async () => {
      const request = createFakeRequest();
      find.mockResolvedValue([request]);

      const getPromise = requestsManager.getAll();

      await expect(getPromise).resolves.toStrictEqual([request]);
    });

    it('rejects on DB error', async () => {
      find.mockRejectedValue(new QueryFailedError('select *', [], new Error()));

      const getPromise = requestsManager.getAll();

      await expect(getPromise).rejects.toThrow(QueryFailedError);
    });

    it('returns undefined if table is empty', async () => {
      find.mockReturnValue(undefined);

      const getPromise = requestsManager.getAll();

      await expect(getPromise).resolves.toBeUndefined();
    });
  });

  describe('#getRequest', () => {
    const findOne = jest.fn();
    beforeEach(() => {
      const repository = ({ findOne } as unknown) as Repository<Request>;
      requestsManager = new RequestsManager(repository, { log: jest.fn() });
    });
    afterEach(() => {
      findOne.mockClear();
    });

    it('returns the request', async () => {
      const request = createFakeRequest();
      findOne.mockResolvedValue(request);

      const getPromise = requestsManager.getRequest(createUuid());

      await expect(getPromise).resolves.toStrictEqual(request);
    });

    it('rejects on DB error', async () => {
      findOne.mockRejectedValue(new QueryFailedError('select *', [], new Error()));

      const getPromise = requestsManager.getRequest(createUuid());

      await expect(getPromise).rejects.toThrow(QueryFailedError);
    });

    it('returns undefined if id not found', async () => {
      findOne.mockReturnValue(undefined);

      const getPromise = requestsManager.getRequest(createUuid());

      await expect(getPromise).resolves.toBeUndefined();
    });
  });
});
