import { container } from 'tsyringe';
import config from 'config';
import { Connection, ConnectionOptions, createConnection } from 'typeorm';
import { Services } from '../../src/common/constants';
import { Request } from '../../src/request/models/request';

async function registerTestValues(): Promise<void> {
  container.register(Services.CONFIG, { useValue: config });
  container.register(Services.LOGGER, { useValue: { log: jest.fn() } });

  const connectionOptions = config.get<ConnectionOptions>('db');
  const connection = await createConnection({ entities: ['src/request/models/*.ts'], ...connectionOptions });
  await connection.synchronize();
  const repo = connection.getRepository(Request);
  container.register(Connection, { useValue: connection });
  container.register('RequestsRepository', { useValue: repo });
}

export { registerTestValues };
