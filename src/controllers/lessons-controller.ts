import { Response } from 'express';
import lessonsService from '@/services/lessons-service';
import { AuthenticatedRequest } from '@/middlewares';
import httpStatus from 'http-status';

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
  res.sendStatus(httpStatus.OK);
}

export async function postLesson(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { title, description, courseId, position, moves, messages, userColor } = req.body;

  try {
    const lesson = await lessonsService.createLesson(
      title,
      description,
      courseId,
      position,
      moves,
      messages,
      userColor,
      userId,
    );
    if (!lesson) {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
    res.status(httpStatus.CREATED).send(lesson);
  } catch (error) {
    res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function patchLesson(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const id = Number(req.params.id);
  const { title, description, courseId, position, moves, messages, userColor } = req.body;

  const lesson = await lessonsService.updateLesson(
    id,
    title,
    description,
    courseId,
    position,
    moves,
    messages,
    userColor,
    userId,
  );
  if (!lesson) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
  res.status(httpStatus.OK).send(lesson);
}

export async function deleteLesson(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const id = Number(req.params.id);

  const lesson = await lessonsService.deleteLesson(id, userId);

  res.sendStatus(httpStatus.OK);
}
