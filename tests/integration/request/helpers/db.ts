import { container } from 'tsyringe';
import { Connection } from 'typeorm';
import { createFakeRequest } from '../../../helpers/helpers';
import { IRequest, Request } from '../../../../src/request/models/request';

export const createDbRequest = async (): Promise<IRequest> => {
  const conn = container.resolve(Connection);
  const repo = conn.getRepository(Request);
  const request = repo.create(createFakeRequest());
  const createdRequest = await repo.save(request);
  return createdRequest;
};
