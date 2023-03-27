import { Router } from 'express';

import { getCourses, getUserCourses, subscribeCourse, deleteSubscribe } from '@/controllers';
import { authenticateToken } from '@/middlewares';

const coursesRouter = Router();

coursesRouter
  .all('/*', authenticateToken)
  .get('/', getCourses)
  .get('/subscribed', getUserCourses)
  .post('/subscribe', subscribeCourse)
  .delete('/subscribe/:subscriptionId', deleteSubscribe);

export { coursesRouter };
