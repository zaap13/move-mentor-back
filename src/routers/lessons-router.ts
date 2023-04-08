import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { getLesson, completeLesson, postLesson, patchLesson, deleteLesson } from '@/controllers';
import { checkSubscription } from '@/middlewares/check-subscription';
import { createLessonSchema } from '@/schemas/lesson-schema';
import { checkOwnership } from '@/middlewares/check-ownership';

const lessonsRouter = Router();

lessonsRouter
  .all('/*', authenticateToken)
  .get('/:id', checkSubscription, getLesson)
  .post('/complete/:id', checkSubscription, completeLesson)
  .post('/', validateBody(createLessonSchema), postLesson)
  .patch('/:id', checkOwnership, validateBody(createLessonSchema), patchLesson)
  .delete('/:id', checkOwnership, deleteLesson);

export { lessonsRouter };
