import { container } from 'tsyringe';
import config from 'config';
import { Connection, ConnectionOptions, createConnection } from 'typeorm';
import { Services } from '../../src/common/constants';
import { Job } from '../../src/job/models/job';

async function registerTestValues(): Promise<void> {
  container.register(Services.CONFIG, { useValue: config });
  container.register(Services.LOGGER, { useValue: { log: jest.fn() } });

  const connectionOptions = config.get<ConnectionOptions>('db');
  const connection = await createConnection({ entities: ['src/job/models/*.ts'], ...connectionOptions });
  await connection.synchronize();
  const repository = connection.getRepository(Job);
  container.register(Connection, { useValue: connection });
  container.register(Services.REPOSITORY, { useValue: repository });
}

export { registerTestValues };
