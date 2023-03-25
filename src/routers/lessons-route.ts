import { Router } from 'express';

import { getCourseLessons, getLesson, completeLesson } from '@/controllers';
import { authenticateToken } from '@/middlewares';

const usersRouter = Router();

usersRouter
  .all('/*', authenticateToken)
  .get('/:id', getCourseLessons)
  .get('/lesson/:id', getLesson)
  .post('/lesson/complete/:id', completeLesson);

export { usersRouter };
