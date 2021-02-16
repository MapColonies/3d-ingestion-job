import { Router } from 'express';
import { FactoryFunction } from 'tsyringe';
import { RequestsController } from '../controllers/requestsController';

const requestRouterFactory: FactoryFunction<Router> = (dependencyContainer) => {
  const router = Router();
  const controller = dependencyContainer.resolve(RequestsController);

  router.get('/', controller.getAll);
  router.get('/:requestId', controller.get);
  router.post('/', controller.post);

  return router;
};

export { requestRouterFactory };
