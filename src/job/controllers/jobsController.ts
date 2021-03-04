import { RequestHandler } from 'express';
import httpStatus from 'http-status-codes';
import { injectable, inject } from 'tsyringe';
import { Services } from '../../common/constants';
import { ILogger } from '../../common/interfaces';
import { JobsManager } from '../models/jobsManager';
import { IJob } from '../models/job';
import { HttpError, NotFoundError } from '../../common/errors';
import { EntityNotFoundError, IdAlreadyExistsError } from '../models/errors';

interface JobParams {
  jobId: string;
}

type GetAllRequestHandler = RequestHandler<undefined, IJob[]>;
type GetRequestHandler = RequestHandler<JobParams, IJob>;
type CreateRequestHandler = RequestHandler<undefined, IJob, IJob>;
type UpdateRequestHandler = RequestHandler<JobParams, IJob, IJob>;

@injectable()
export class JobsController {
  public constructor(@inject(JobsManager) private readonly manager: JobsManager, @inject(Services.LOGGER) private readonly logger: ILogger) {}

  public getAll: GetAllRequestHandler = async (req, res, next) => {
    try {
      const jobs = await this.manager.getAll();
      if (!jobs || jobs.length == 0) {
        return res.sendStatus(httpStatus.NO_CONTENT);
      }
      return res.status(httpStatus.OK).json(jobs);
    } catch (error) {
      return next(error);
    }
  };

  public get: GetRequestHandler = async (req, res, next) => {
    try {
      const { jobId } = req.params;
      const job = await this.manager.getJob(jobId);
      if (!job) {
        const error = new NotFoundError('Job with given id was not found.');
        return next(error);
      }
      return res.status(httpStatus.OK).json(job);
    } catch (error) {
      return next(error);
    }
  };

  public post: CreateRequestHandler = async (req, res, next) => {
    try {
      const job = await this.manager.createJob(req.body);
      return res.status(httpStatus.CREATED).json(job);
    } catch (error) {
      if (error instanceof IdAlreadyExistsError) {
        (error as HttpError).status = httpStatus.UNPROCESSABLE_ENTITY;
      }
      return next(error);
    }
  };

  public patch: UpdateRequestHandler = async (req, res, next) => {
    try {
      const { jobId } = req.params;
      const job = await this.manager.updateJob(jobId, req.body);
      return res.status(httpStatus.OK).json(job);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        (error as HttpError).status = httpStatus.NOT_FOUND;
      }
      return next(error);
    }
  };
}
