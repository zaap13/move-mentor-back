import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getLesson, completeLesson } from '@/controllers';

const lessonsRouter = Router();

lessonsRouter.all('/*', authenticateToken).get('/:id', getLesson).post('/complete/:id', completeLesson);

export { lessonsRouter };
