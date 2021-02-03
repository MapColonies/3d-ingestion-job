import { RequestHandler } from 'express';
import httpStatus from 'http-status-codes';
import { injectable, inject } from 'tsyringe';
import { Services } from '../../common/constants';
import { ILogger } from '../../common/interfaces';
import { RequestsManager } from '../models/requestsManager';
import { IRequest } from '../models/request';
import { HttpError, NotFoundError } from '../../common/errors';
import { IdAlreadyExistsError } from '../models/errors';

interface RequestParams {
  requestId: string;
}

type GetAllRequestsHandler = RequestHandler<undefined, IRequest[]>;
type GetRequestHandler = RequestHandler<RequestParams, IRequest>;
type CreateRequestHandler = RequestHandler<IRequest, IRequest>;

@injectable()
export class RequestsController {
  public constructor(@inject(RequestsManager) private readonly manager: RequestsManager, @inject(Services.LOGGER) private readonly logger: ILogger) {}

  public getAll: GetAllRequestsHandler = async (req, res, next) => {
    let requests: IRequest[] | undefined;
    try {
      requests = await this.manager.getAll();
    } catch (error) {
      return next(error);
    }
    if (!requests || requests.length == 0) {
      return res.sendStatus(httpStatus.NO_CONTENT);
    }
    return res.status(httpStatus.OK).json(requests);
  };

  public get: GetRequestHandler = async (req, res, next) => {
    const { requestId } = req.params;
    let request: IRequest | undefined;
    try {
      request = await this.manager.getRequest(requestId);
    } catch (error) {
      return next(error);
    }
    if (!request) {
      const error = new NotFoundError('Request with given id was not found.');
      return next(error);
    }
    return res.status(httpStatus.OK).json(request);
  };

  public post: CreateRequestHandler = async (req, res, next) => {
    let request: IRequest | undefined;
    try {
      request = await this.manager.createRequest(req.body);
    } catch (error) {
      if (error instanceof IdAlreadyExistsError) {
        (error as HttpError).status = httpStatus.UNPROCESSABLE_ENTITY;
      }
      return next(error);
    }
    return res.status(httpStatus.CREATED).json(request);
  };
}
