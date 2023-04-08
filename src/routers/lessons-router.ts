import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { getLesson, completeLesson, postLesson, patchLesson, deleteLesson } from '@/controllers';
import { checkSubscription } from '@/middlewares/check-subscription';
import { createLessonSchema } from '@/schemas/lesson-schema';

const lessonsRouter = Router();

lessonsRouter
  .all('/*', authenticateToken)
  .get('/:id', checkSubscription, getLesson)
  .post('/complete/:id', checkSubscription, completeLesson)
  .post('/', validateBody(createLessonSchema), postLesson)
  .patch('/:id', validateBody(createLessonSchema), checkSubscription, patchLesson)
  .delete('/:id', checkSubscription, deleteLesson);

export { lessonsRouter };
