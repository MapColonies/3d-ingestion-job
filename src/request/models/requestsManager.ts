import { inject, injectable } from 'tsyringe';
import { v4 as uuid } from 'uuid';
import { Repository } from 'typeorm';
import { Services } from '../../common/constants';
import { ILogger } from '../../common/interfaces';
import { Request } from './request';
import { AlreadyExistsError } from './errors';

@injectable()
export class RequestsManager {
  public constructor(
    @inject('RequestsRepository') private readonly repository: Repository<Request>,
    @inject(Services.LOGGER) private readonly logger: ILogger
  ) {}

  public async getAll(): Promise<Request[] | undefined> {
    this.logger.log('info', `Get all requests`);
    return this.repository.find();
  }

  public async getRequest(requestId: string): Promise<Request | undefined> {
    this.logger.log('info', `Get request ${requestId}`);
    return this.repository.findOne(requestId);
  }

  public async createRequest(newRequest: Request): Promise<Request> {
    this.logger.log('info', `Creating a new request ${JSON.stringify(newRequest)}`);
    newRequest.requestId = uuid();
    const dbRequest = await this.repository.findOne({ where: [{ requestId: newRequest.requestId }] });
    if (dbRequest) {
      throw new AlreadyExistsError(`requestId=${newRequest.requestId} already exists`);
    }
    await this.repository.insert(newRequest);
    return newRequest;
  }
}
