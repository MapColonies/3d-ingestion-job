import { readFileSync } from 'fs';
import { ILoggerConfig, IServiceConfig, MCLogger } from '@map-colonies/mc-logger';
import { Probe } from '@map-colonies/mc-probe';
import config from 'config';
import { container } from 'tsyringe';
import { Connection, ConnectionOptions, createConnection } from 'typeorm';
import { Request } from './request/models/request';
import { Services } from './common/constants';
import { promiseTimeout } from './common/utils/promiseTimeout';

const dbTimeout = 5000;

const healthCheck = (connection: Connection): (() => Promise<void>) => {
  return async (): Promise<void> => {
    const check = connection.query('SELECT 1').then(() => {
      return;
    });
    return promiseTimeout<void>(dbTimeout, check);
  };
};

const beforeShutdown = (connection: Connection): (() => Promise<void>) => {
  return async (): Promise<void> => {
    await connection.close();
  };
};

async function registerExternalValues(): Promise<void> {
  const loggerConfig = config.get<ILoggerConfig>('logger');
  const packageContent = readFileSync('./package.json', 'utf8');
  const service = JSON.parse(packageContent) as IServiceConfig;
  const logger = new MCLogger(loggerConfig, service);
  container.register(Services.CONFIG, { useValue: config });
  container.register(Services.LOGGER, { useValue: logger });

  const connectionOptions = config.get<ConnectionOptions>('db');
  const connection = await createConnection({ entities: ['request/models/*.js'], ...connectionOptions });
  container.register(Connection, { useValue: connection });
  container.register(Services.REPOSITORY, { useValue: connection.getRepository(Request) });

  container.register<Probe>(Probe, {
    useFactory: (container) =>
      new Probe(container.resolve(Services.LOGGER), { liveness: healthCheck(connection), beforeShutdown: beforeShutdown(connection) }),
  });
}

export { registerExternalValues };
