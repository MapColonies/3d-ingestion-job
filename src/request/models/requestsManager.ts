import { inject, injectable } from 'tsyringe';
import { v4 as uuid } from 'uuid';
import { Repository } from 'typeorm';
import { Services } from '../../common/constants';
import { ILogger } from '../../common/interfaces';
import { Request, IRequest } from './request';
import { IdAlreadyExistsError } from './errors';

@injectable()
export class RequestsManager {
  public constructor(
    @inject(Services.REPOSITORY) private readonly repository: Repository<Request>,
    @inject(Services.LOGGER) private readonly logger: ILogger
  ) {}

  public async createRequest(newRequest: IRequest): Promise<IRequest> {
    this.logger.log('info', `Creating a new request ${JSON.stringify(newRequest)}`);
    newRequest.requestId = uuid();
    const dbRequest = await this.repository.findOne({ where: [{ requestId: newRequest.requestId }] });
    if (dbRequest) {
      throw new IdAlreadyExistsError(`requestId=${dbRequest.requestId} already exists`);
    }
    await this.repository.insert(newRequest);
    return newRequest;
  }

  public async getAll(): Promise<IRequest[] | undefined> {
    this.logger.log('info', `Get all requests`);
    return this.repository.find();
  }

  public async getRequest(requestId: string): Promise<IRequest | undefined> {
    this.logger.log('info', `Get request ${requestId}`);
    return this.repository.findOne(requestId);
  }
}
