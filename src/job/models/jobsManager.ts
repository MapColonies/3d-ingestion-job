import { inject, injectable } from 'tsyringe';
import { v4 as uuid } from 'uuid';
import { Repository } from 'typeorm';
import { Services } from '../../common/constants';
import { ILogger } from '../../common/interfaces';
import { Job, IJob } from './job';
import { EntityNotFoundError, IdAlreadyExistsError } from './errors';

@injectable()
export class JobsManager {
  public constructor(
    @inject(Services.REPOSITORY) private readonly repository: Repository<Job>,
    @inject(Services.LOGGER) private readonly logger: ILogger
  ) {}

  public async getAll(): Promise<IJob[] | undefined> {
    this.logger.log('info', `Get all jobs`);
    return this.repository.find();
  }

  public async getJob(jobId: string): Promise<IJob | undefined> {
    this.logger.log('info', `Get job ${jobId}`);
    return this.repository.findOne(jobId);
  }

  public async createJob(newJob: IJob): Promise<IJob> {
    this.logger.log('info', `Create a new job: ${JSON.stringify(newJob)}`);
    let dbJob: IJob | undefined;
    let retries = 3;
    do {
      newJob.jobId = uuid();
      dbJob = await this.repository.findOne({ where: [{ jobId: newJob.jobId }] });
    } while (dbJob != undefined && --retries > 0);
    if (dbJob != undefined) {
      throw new IdAlreadyExistsError(`Job ${dbJob.jobId} already exists`);
    }
    await this.repository.insert(newJob);
    return newJob;
  }

  public async updateJob(jobId: string, job: IJob): Promise<IJob> {
    this.logger.log('info', `Update job ${jobId}: ${JSON.stringify(job)}`);
    const dbJob = await this.repository.findOne(jobId);
    if (dbJob == undefined) {
      throw new EntityNotFoundError(`Job ${jobId} does not exist`);
    }
    dbJob.status = job.status;
    dbJob.updated = new Date();
    const updatedJob = await this.repository.save(dbJob);
    return updatedJob;
  }
}
