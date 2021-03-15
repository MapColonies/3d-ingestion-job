import * as supertest from 'supertest';
import { Application } from 'express';
import { container } from 'tsyringe';
import { ServerBuilder } from '../../../../../src/serverBuilder';
import { Services } from '../../../../../src/common/constants';

export function getApp(): Application {
  const builder = container.resolve<ServerBuilder>(ServerBuilder);
  return builder.build();
}

export function getMockedRepoApp(repo: unknown): Application {
  container.register(Services.REPOSITORY, { useValue: repo });
  return getApp();
}

export async function getAll(app: Application): Promise<supertest.Response> {
  return supertest.agent(app).get('/jobs').set('Content-Type', 'application/json');
}

export async function getJob(app: Application, jobId: string): Promise<supertest.Response> {
  return supertest.agent(app).get(`/jobs/${jobId}`).set('Content-Type', 'application/json');
}

export async function createJob(app: Application, body: { path?: unknown; metadata?: unknown }): Promise<supertest.Response> {
  return supertest.agent(app).post('/jobs').set('Content-Type', 'application/json').send(body);
}

export async function updateJob(app: Application, jobId: string, body: { status?: unknown }): Promise<supertest.Response> {
  return supertest.agent(app).patch(`/jobs/${jobId}`).set('Content-Type', 'application/json').send(body);
}
