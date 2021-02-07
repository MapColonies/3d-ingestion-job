import * as supertest from 'supertest';
import { Application } from 'express';

import { container } from 'tsyringe';
import { ServerBuilder } from '../../../../src/serverBuilder';
import { Services } from '../../../../src/common/constants';

export function getApp(): Application {
  const builder = container.resolve<ServerBuilder>(ServerBuilder);
  return builder.build();
}

export function getMockedRepoApp(repo: unknown): Application {
  container.register(Services.REPOSITORY, { useValue: repo });
  const builder = container.resolve<ServerBuilder>(ServerBuilder);
  return builder.build();
}

export async function getAll(app: Application): Promise<supertest.Response> {
  return supertest.agent(app).get('/requests').set('Content-Type', 'application/json');
}

export async function getRequest(app: Application, requestId: string): Promise<supertest.Response> {
  return supertest.agent(app).get(`/requests/${requestId}`).set('Content-Type', 'application/json');
}

export async function createRequest(app: Application, request: { path?: unknown; metadata?: unknown }): Promise<supertest.Response> {
  return supertest.agent(app).post('/requests').set('Content-Type', 'application/json').send(request);
}
