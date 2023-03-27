import { Request, Response } from 'express';
import lessonsService from '@/services/lessons-service';
import { AuthenticatedRequest } from '@/middlewares';

export async function getLesson(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const { userId } = req;

  const lesson = await lessonsService.getLesson(Number(id), userId);
  res.send(lesson);
}

export async function completeLesson(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const { userId } = req;

  await lessonsService.completeLesson(Number(id), userId);
  res.sendStatus(200);
}
