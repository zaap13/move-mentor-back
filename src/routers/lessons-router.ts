import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getLesson, completeLesson, postLesson, patchLesson, deleteLesson } from '@/controllers';
import { checkSubscription } from '@/middlewares/check-subscription';

const lessonsRouter = Router();

lessonsRouter
  .all('/*', authenticateToken)
  .get('/:id', checkSubscription, getLesson)
  .post('/complete/:id', checkSubscription, completeLesson)
  .post('/', postLesson)
  .patch('/:id', patchLesson)
  .delete('/:id', deleteLesson);

export { lessonsRouter };
