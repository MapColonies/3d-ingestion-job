export const DEFAULT_SERVER_PORT = 80;

export enum Services {
  LOGGER = 'ILogger',
  CONFIG = 'IConfig',
  REPOSITORY = 'JobsRepository',
}

export enum Status {
  PENDING = 'Pending',
  PROGRESS = 'In-Progress',
  COMPLETED = 'Completed',
  FAILED = 'Failed',
}
