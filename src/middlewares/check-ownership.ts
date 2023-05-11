// src/middlewares/checkSubscription.ts
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authentication-middleware';
import { prisma } from '@/config';
import httpStatus, { FORBIDDEN } from 'http-status';

export async function checkOwnership(req: AuthenticatedRequest, res: Response, next: NextFunction) {
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

  const course = await prisma.course.findFirst({
    where: {
      id: courseId,
    },
  });

  if (course.creatorId !== userId) {
    return res.sendStatus(httpStatus.FORBIDDEN);
  }

  next();
}

export async function courseOwnership(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const id = parseInt(req.params.id);
  const { userId } = req;

  const course = await prisma.course.findFirst({
    where: {
      id: id,
    },
  });

  if (!course) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }

  if (course.creatorId !== userId) {
    return res.sendStatus(httpStatus.FORBIDDEN);
  }

  next();
}
