import { Router } from 'express';
import { FactoryFunction } from 'tsyringe';
import { JobsController } from '../controllers/jobsController';

const jobsRouterFactory: FactoryFunction<Router> = (dependencyContainer) => {
  const router = Router();
  const controller = dependencyContainer.resolve(JobsController);

  router.get('/', controller.getAll);
  router.get('/:jobId', controller.get);
  router.post('/', controller.post);
  router.patch('/:jobId', controller.patch);

  return router;
};

export { jobsRouterFactory };
