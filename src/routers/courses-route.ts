import { Router } from 'express';

import { getCourses, getUserCourses, subscribeCourse, deleteSubscribe } from '@/controllers';
import { authenticateToken } from '@/middlewares';

const usersRouter = Router();

usersRouter
  .all('/*', authenticateToken)
  .get('/', getCourses)
  .get('/:id', getUserCourses)
  .post('/subscribe', subscribeCourse)
  .delete('/subscribe/:subscriptionId', deleteSubscribe);

export { usersRouter };
