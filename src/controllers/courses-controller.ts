import { Request, Response } from 'express';
import coursesService from '@/services/courses-service';
import { AuthenticatedRequest } from '@/middlewares';

export async function getCourses(req: AuthenticatedRequest, res: Response) {
  const courses = await coursesService.listCourses();
  res.json(courses);
}

export async function getUserCourses(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const courses = await coursesService.listUserCourses(Number(userId));
  res.json(courses);
}

export async function subscribeCourse(req: AuthenticatedRequest, res: Response) {
  const { courseId } = req.body;
  const { userId } = req;
  const subscription = await coursesService.subscribeToCourse(userId, courseId);
  res.json(subscription);
}

export async function deleteSubscribe(req: AuthenticatedRequest, res: Response): Promise<void> {
    const subscriptionId = Number(req.params.subscriptionId);
    const { userId } = req;

    await coursesService.unsubscribeFromCourse(subscriptionId, userId);
    res.sendStatus(200);
  }