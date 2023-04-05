import { Request, Response } from 'express';
import lessonsService from '@/services/lessons-service';
import { AuthenticatedRequest } from '@/middlewares';
import httpStatus from 'http-status';

export async function getLesson(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const { userId } = req;

  try {
    const lesson = await lessonsService.getLesson(Number(id), userId);
    res.send(lesson);
  } catch (error) {
    res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function completeLesson(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const { userId } = req;

  try {
    await lessonsService.completeLesson(Number(id), userId);
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(httpStatus.NOT_FOUND);
  }
}
