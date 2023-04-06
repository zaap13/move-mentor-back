// src/middlewares/checkSubscription.ts
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authentication-middleware';
import { prisma } from '@/config';

export async function checkSubscription(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const id = parseInt(req.params.id);
  const { userId } = req;

  const lesson = await prisma.lesson.findFirst({
    where: {
      id: id,
    },
  });

  if (!lesson) {
    return res.sendStatus(404);
  }

  const { courseId } = lesson;

  const subscription = await prisma.subscription.findFirst({
    where: {
      userId: userId,
      courseId: courseId,
    },
  });

  if (!subscription) {
    return res.status(403).send({ error: 'You need to subscribe to the course to access this content.' });
  }

  next();
}
