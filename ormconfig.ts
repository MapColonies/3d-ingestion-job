import config from 'config';
import { ConnectionOptions } from 'typeorm';

const connectionOptions = config.get<ConnectionOptions>('db');

module.exports = {
  ...connectionOptions,
  entities: ['src/job/models/*.ts'],
  migrationsTableName: 'jobs_migration_table',
  migrations: ['db/migration/*.ts'],
  cli: {
    migrationsDir: 'db/migration',
  },
};
