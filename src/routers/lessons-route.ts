import { Router } from 'express';

import { getLesson, completeLesson } from '@/controllers';
import { authenticateToken } from '@/middlewares';

const usersRouter = Router();

usersRouter
  .all('/*', authenticateToken)
  .get('/lesson/:id', getLesson)
  .post('/lesson/complete/:id', completeLesson);

export { usersRouter };
