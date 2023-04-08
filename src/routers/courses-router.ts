import { Router } from 'express';

import {
  getCourses,
  getUserCourses,
  subscribeCourse,
  deleteSubscribe,
  postCourse,
  patchCourse,
  deleteCourse,
} from '@/controllers';
import { authenticateToken, validateBody } from '@/middlewares';
import { createCourseSchema } from '@/schemas/course-schema';
import { courseOwnership } from '@/middlewares/check-ownership';

const coursesRouter = Router();

coursesRouter
  .all('/*', authenticateToken)
  .get('/', getCourses)
  .get('/subscribed', getUserCourses)
  .post('/subscribe', subscribeCourse)
  .delete('/subscribe/:subscriptionId', deleteSubscribe)
  .post('/', validateBody(createCourseSchema), postCourse)
  .patch('/:id', courseOwnership, validateBody(createCourseSchema), patchCourse)
  .delete('/:id', courseOwnership, deleteCourse);

export { coursesRouter };
