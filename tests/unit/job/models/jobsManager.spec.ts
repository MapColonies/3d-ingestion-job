import { QueryFailedError, Repository } from 'typeorm';
import { Job } from '../../../../src/job/models/job';
import { JobsManager } from '../../../../src/job/models/jobsManager';
import { EntityNotFoundError, IdAlreadyExistsError } from '../../../../src/job/models/errors';
import { createFakeJob, createUuid } from '../../../helpers/helpers';
import { OperationStatus } from '../../../../src/common/constants';

let jobsManager: JobsManager;

describe('JobsManager', () => {
  describe('#createJob', () => {
    const insert = jest.fn();
    const findOne = jest.fn();
    beforeEach(() => {
      const repository = ({ insert, findOne } as unknown) as Repository<Job>;
      jobsManager = new JobsManager(repository, { log: jest.fn() });
    });
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('resolves without errors if id is not in use', async () => {
      findOne.mockResolvedValue(undefined);
      insert.mockResolvedValue(undefined);
      const job = createFakeJob();

      const createPromise = jobsManager.createJob(job);

      await expect(createPromise).resolves.toStrictEqual(job);
    });

    it('rejects on DB error', async () => {
      findOne.mockRejectedValue(new QueryFailedError('select *', [], new Error()));
      const job = createFakeJob();

      const createPromise = jobsManager.createJob(job);

      await expect(createPromise).rejects.toThrow(QueryFailedError);
    });

    it('rejects if id already exists', async () => {
      const job = createFakeJob();
      findOne.mockResolvedValue(job);
      insert.mockResolvedValue(undefined);

      const createPromise = jobsManager.createJob(job);

      await expect(createPromise).rejects.toThrow(IdAlreadyExistsError);
    });
  });

  describe('#getAll', () => {
    const find = jest.fn();
    beforeEach(() => {
      const repository = ({ find } as unknown) as Repository<Job>;
      jobsManager = new JobsManager(repository, { log: jest.fn() });
    });
    afterEach(() => {
      find.mockClear();
    });

    it('returns a jobs list', async () => {
      const job = createFakeJob();
      find.mockResolvedValue([job]);

      const getPromise = jobsManager.getAll();

      await expect(getPromise).resolves.toStrictEqual([job]);
    });

    it('rejects on DB error', async () => {
      find.mockRejectedValue(new QueryFailedError('select *', [], new Error()));

      const getPromise = jobsManager.getAll();

      await expect(getPromise).rejects.toThrow(QueryFailedError);
    });

    it('returns undefined if table is empty', async () => {
      find.mockReturnValue(undefined);

      const getPromise = jobsManager.getAll();

      await expect(getPromise).resolves.toBeUndefined();
    });
  });

  describe('#getJob', () => {
    const findOne = jest.fn();
    beforeEach(() => {
      const repository = ({ findOne } as unknown) as Repository<Job>;
      jobsManager = new JobsManager(repository, { log: jest.fn() });
    });
    afterEach(() => {
      findOne.mockClear();
    });

    it('returns the job', async () => {
      const job = createFakeJob();
      findOne.mockResolvedValue(job);

      const getPromise = jobsManager.getJob(createUuid());

      await expect(getPromise).resolves.toStrictEqual(job);
    });

    it('rejects on DB error', async () => {
      findOne.mockRejectedValue(new QueryFailedError('select *', [], new Error()));

      const getPromise = jobsManager.getJob(createUuid());

      await expect(getPromise).rejects.toThrow(QueryFailedError);
    });

    it('returns undefined if id not found', async () => {
      findOne.mockReturnValue(undefined);

      const getPromise = jobsManager.getJob(createUuid());

      await expect(getPromise).resolves.toBeUndefined();
    });
  });

  describe('#updateJob', () => {
    const save = jest.fn();
    const findOne = jest.fn();
    beforeEach(() => {
      const repository = ({ save, findOne } as unknown) as Repository<Job>;
      jobsManager = new JobsManager(repository, { log: jest.fn() });
    });
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('returns the job', async () => {
      const job = createFakeJob();
      findOne.mockResolvedValue(job);
      job.status = OperationStatus.COMPLETED;
      save.mockResolvedValue(job);

      const updatePromise = jobsManager.updateJob(job.id, job);

      await expect(updatePromise).resolves.toStrictEqual(job);
    });

    it('rejects on DB error', async () => {
      save.mockRejectedValue(new QueryFailedError('select *', [], new Error()));
      const job = createFakeJob();

      const updatePromise = jobsManager.updateJob(job.id, job);

      await expect(updatePromise).rejects.toThrow(QueryFailedError);
    });

    it('rejects if job not found', async () => {
      findOne.mockReturnValue(undefined);
      const job = createFakeJob();

      const updatePromise = jobsManager.updateJob(job.id, job);

      await expect(updatePromise).rejects.toThrow(EntityNotFoundError);
    });
  });
});
