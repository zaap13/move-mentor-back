// src/middlewares/checkSubscription.ts
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authentication-middleware';
import { prisma } from '@/config';
import httpStatus, { FORBIDDEN } from 'http-status';

export async function checkSubscription(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const id = parseInt(req.params.id);
  const { userId } = req;

  const lesson = await prisma.lesson.findFirst({
    where: {
      id: id,
    },
  });

  if (!lesson) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }

  const { courseId } = lesson;

  const subscription = await prisma.subscription.findFirst({
    where: {
      userId: userId,
      courseId: courseId,
    },
  });

  if (!subscription) {
    return res.status(FORBIDDEN).send({ error: 'You need to subscribe to the course to access this content.' });
  }

  next();
}
