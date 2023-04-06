import { Router } from 'express';

import { getCourses, getUserCourses, subscribeCourse, deleteSubscribe, postCourse, patchCourse, deleteCourse } from '@/controllers';
import { authenticateToken } from '@/middlewares';

const coursesRouter = Router();

coursesRouter
  .all('/*', authenticateToken)
  .get('/', getCourses)
  .get('/subscribed', getUserCourses)
  .post('/subscribe', subscribeCourse)
  .delete('/subscribe/:subscriptionId', deleteSubscribe)
  .post('/', postCourse)
  .patch('/:id', patchCourse)
  .delete('/:id', deleteCourse);

export { coursesRouter };
